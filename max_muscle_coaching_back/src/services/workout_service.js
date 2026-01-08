/**
 * Workout domain service (business logic).
 *
 * This file contains the "source of truth" for:
 * - Selecting/creating today's workout session (`WorkoutHistory`)
 * - Hydrating workout templates with exercises/media
 * - Storing per-exercise progress (`WorkoutHistoryExercise`)
 * - Syncing workout completion (`WorkoutHistory.completed`)
 *
 * HTTP endpoints using this service: `src/controllers/user_workout_controller.js`
 * Endpoint docs: `docs/API.md`
 */
const WorkoutTemplate = require("../models/workout_template_model");
const WorkoutTemplateExercise = require("../models/workout_template_exercise_model");
const WorkoutHistory = require("../models/workout_history_model");
const WorkoutHistoryExercise = require("../models/workout_history_exercise_model");
const Exercise = require("../models/exercise_model");
// const Muscle = require("../models/muscle_model");
const Instruction = require("../models/instruction_model");
const Gallery = require("../models/gallery_model");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

/**
 * Encapsulates workout template and workout history workflows.
 */
class WorkoutService {
  /**
   * Ensures `WorkoutHistoryExercise` rows exist for the given history, based on
   * the template definition (`WorkoutTemplateExercise`).
   *
   * This is idempotent: it uses `bulkCreate(..., { ignoreDuplicates: true })`.
   */
  async _ensureHistoryExercisesFromTemplate(
    workoutHistoryId,
    workoutTemplateId
  ) {
    const planned = await WorkoutTemplateExercise.findAll({
      where: { workoutTemplateId },
      order: [["orderIndex", "ASC"]],
      raw: true,
    });

    if (!planned.length) return [];

    const rows = planned.map((row) => ({
      workoutHistoryId,
      exerciseId: row.exerciseId,
      orderIndex: row.orderIndex,
      plannedSets: row.sets,
      plannedReps: row.reps,
      plannedRestSeconds: row.restSeconds,
      plannedNotes: row.notes,
      performedSets: [],
      completed: false,
    }));

    await WorkoutHistoryExercise.bulkCreate(rows, {
      ignoreDuplicates: true,
    });

    return rows;
  }

  /**
   * Validates/normalizes performed sets payload.
   *
   * Accepts an array of `{ setNumber?, reps, weight?, notes? }` and returns a clean array
   * or `null` when the payload is invalid.
   */
  _normalizePerformedSets(performedSets) {
    if (!Array.isArray(performedSets)) return null;

    const normalized = performedSets
      .map((set, index) => {
        const setNumber =
          Number.isFinite(Number(set?.setNumber)) && Number(set.setNumber) > 0
            ? Number(set.setNumber)
            : index + 1;

        const reps = Number(set?.reps);
        if (!Number.isFinite(reps) || reps < 0) return null;

        const weightValue =
          set?.weight === undefined ||
          set?.weight === null ||
          set?.weight === ""
            ? null
            : Number(set.weight);
        const weight = Number.isFinite(weightValue) ? weightValue : null;

        const notes =
          typeof set?.notes === "string" && set.notes.trim()
            ? set.notes.trim()
            : undefined;

        return { setNumber, reps, weight, ...(notes ? { notes } : {}) };
      })
      .filter(Boolean);

    return normalized;
  }

  _dateOnly(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  _trainingDaysForDaysPerWeek(daysPerWeek) {
    const days = Number(daysPerWeek) || 4;
    // 0=Sun ... 6=Sat
    if (days <= 3) return [1, 3, 5];
    if (days === 4) return [1, 2, 4, 5];
    if (days === 5) return [1, 2, 3, 5, 6];
    if (days === 6) return [1, 2, 3, 4, 5, 6];
    return [0, 1, 2, 3, 4, 5, 6];
  }

  _categoriesForSplit(split) {
    switch (split) {
      case "Push/Pull/Legs":
        return ["Push", "Pull", "Legs"];
      case "Upper/Lower":
        return ["Upper", "Lower"];
      case "Full Body":
        return ["Full Body"];
      case "Bro Split":
        return ["Chest", "Back", "Legs", "Shoulders", "Arms"];
      default:
        return ["Push", "Pull", "Legs"];
    }
  }

  _pickCategoryForToday({ split, daysPerWeek, dayIndex }) {
    const trainingDays = this._trainingDaysForDaysPerWeek(daysPerWeek);
    if (!trainingDays.includes(dayIndex)) return null; // rest day

    const idxInTraining = trainingDays.indexOf(dayIndex);
    const categories = this._categoriesForSplit(split);
    return categories[idxInTraining % categories.length] || categories[0];
  }

  /**
   * Counts progress rows for a given workout history.
   *
   * Used to determine if a session is completed (all exercises marked `completed=true`).
   */
  async _getWorkoutHistoryExerciseCompletion(workoutHistoryId) {
    const [totalExercises, completedExercises] = await Promise.all([
      WorkoutHistoryExercise.count({ where: { workoutHistoryId } }),
      WorkoutHistoryExercise.count({
        where: { workoutHistoryId, completed: true },
      }),
    ]);

    return {
      totalExercises,
      completedExercises,
      allCompleted: totalExercises > 0 && completedExercises === totalExercises,
    };
  }

  /**
   * Recomputes and persists `WorkoutHistory.completed` based on progress rows.
   */
  async _syncWorkoutHistoryCompletion(workoutHistoryId) {
    const stats = await this._getWorkoutHistoryExerciseCompletion(
      workoutHistoryId
    );

    await WorkoutHistory.update(
      { completed: Boolean(stats.allCompleted) },
      { where: { id: workoutHistoryId } }
    );

    return stats;
  }

  /**
   * Returns a list of recommended templates for a user.
   *
   * Options:
   * - `includeExercises`: include `Exercises` + media (default true)
   * - `limit`: optional numeric limit
   * - `excludeRestDays`: exclude rest-day templates (default true)
   */
  async getRecommendedTemplatesForUser(user, options = {}) {
    const { includeExercises = true, limit, excludeRestDays = true } = options;

    const split = user.split || "Push/Pull/Legs";
    const fitnessLevel = user.fitnessLevel || "Beginner";
    const location = user.location || "Gym";
    const categories = this._categoriesForSplit(split);

    const whereClause = {
      split,
      fitnessLevel,
      location,
      ...(excludeRestDays ? { isRestDay: false } : {}),
      category: { [Op.in]: categories },
    };

    if (user.sessionDurationMinutes) {
      whereClause.estimatedDurationMinutes = {
        [Op.between]: [
          Math.max(0, user.sessionDurationMinutes - 15),
          user.sessionDurationMinutes + 15,
        ],
      };
    }

    const templates = await WorkoutTemplate.findAll({
      where: whereClause,
      ...(typeof limit === "number" ? { limit } : {}),
      order: [
        ["category", "ASC"],
        ["name", "ASC"],
      ],
      include: includeExercises
        ? [
            {
              model: Exercise,
              through: {
                attributes: [
                  "orderIndex",
                  "sets",
                  "reps",
                  "restSeconds",
                  "notes",
                ],
              },
              include: [
                { model: Gallery, required: false },
                { model: Instruction, required: false },
              ],
            },
          ]
        : [],
    });

    // Ensure ordered exercises for each template
    return templates.map((template) => {
      const json = template.toJSON();
      if (Array.isArray(json.Exercises)) {
        json.Exercises.sort(
          (a, b) =>
            (a.WorkoutTemplateExercise?.orderIndex ?? 0) -
            (b.WorkoutTemplateExercise?.orderIndex ?? 0)
        );
      }
      return json;
    });
  }

  /**
   * Returns (or creates) today's workout session for a user.
   *
   * If today's session is already completed (all exercises checked), returns:
   * `{ message: "work_already_done", dateAssigned, workoutHistoryId }`.
   */
  async getTodayWorkoutForUser(user) {
    const today = new Date();
    today.setDate(today.getDate() + 5);

    const dateAssigned = this._dateOnly(today);

    let existing = await WorkoutHistory.findOne({
      where: { userId: user.id, dateAssigned },
      include: [{ model: WorkoutTemplate, required: true }],
    });
    existing = null;
    if (existing) {
      if (existing.completed && !existing.WorkoutTemplate?.isRestDay) {
        return {
          message: "work_already_done",
          dateAssigned,
          workoutHistoryId: existing.id,
        };
      }

      await this._ensureHistoryExercisesFromTemplate(
        existing.id,
        existing.workoutTemplateId
      );

      const stats = await this._getWorkoutHistoryExerciseCompletion(
        existing.id
      );
      if (stats.allCompleted && !existing.WorkoutTemplate?.isRestDay) {
        return {
          message: "work_already_done",
          dateAssigned,
          workoutHistoryId: existing.id,
        };
      }

      const progressRows = await WorkoutHistoryExercise.findAll({
        where: { workoutHistoryId: existing.id },
        order: [["orderIndex", "ASC"]],
      });

      const template = await WorkoutTemplate.findByPk(
        existing.workoutTemplateId,
        {
          include: [
            {
              model: Exercise,
              through: {
                attributes: [
                  "orderIndex",
                  "sets",
                  "reps",
                  "restSeconds",
                  "notes",
                ],
              },
              include: [
                { model: Gallery, required: false },
                { model: Instruction, required: false },
              ],
            },
          ],
        }
      );

      const payload =
        template?.toJSON?.() || existing.WorkoutTemplate?.toJSON?.();
      if (payload?.Exercises) {
        payload.Exercises.sort(
          (a, b) =>
            (a.WorkoutTemplateExercise?.orderIndex ?? 0) -
            (b.WorkoutTemplateExercise?.orderIndex ?? 0)
        );
      }

      return {
        dateAssigned,
        restDay: Boolean(existing.WorkoutTemplate?.isRestDay),
        workoutHistoryId: existing.id,
        template: payload,
        exerciseProgress: progressRows.map((row) => row.toJSON()),
      };
    }

    const dayIndex = today.getDay();
    const category = this._pickCategoryForToday({
      split: user.split,
      daysPerWeek: user.daysPerWeek,
      dayIndex,
    });

    if (!category) {
      const restTemplate = await WorkoutTemplate.findOne({
        where: { isRestDay: true },
        order: [["id", "ASC"]],
      });

      let history = null;
      if (restTemplate) {
        history = await WorkoutHistory.create({
          userId: user.id,
          workoutTemplateId: restTemplate.id,
          dateAssigned,
          completed: false,
        });
        await this._ensureHistoryExercisesFromTemplate(
          history.id,
          restTemplate.id
        );
      }

      return {
        dateAssigned,
        restDay: true,
        workoutHistoryId: history?.id ?? null,
        template: restTemplate?.toJSON?.() || null,
        exerciseProgress: [],
      };
    }

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = await WorkoutHistory.findAll({
      where: {
        userId: user.id,
        dateAssigned: { [Op.gte]: this._dateOnly(sevenDaysAgo) },
      },
      attributes: ["workoutTemplateId"],
      raw: true,
    });
    const recentIds = recent.map((row) => row.workoutTemplateId);

    const whereClause = {
      split: user.split || "Push/Pull/Legs",
      fitnessLevel: user.fitnessLevel || "Beginner",
      location: user.location || "Gym",
      category,
      isRestDay: false,
      ...(recentIds.length ? { id: { [Op.notIn]: recentIds } } : {}),
    };

    if (user.sessionDurationMinutes) {
      whereClause.estimatedDurationMinutes = {
        [Op.between]: [
          Math.max(0, user.sessionDurationMinutes - 15),
          user.sessionDurationMinutes + 15,
        ],
      };
    }

    let template = await WorkoutTemplate.findOne({
      where: whereClause,
      order: [["id", "ASC"]],
    });

    if (!template && whereClause.estimatedDurationMinutes) {
      delete whereClause.estimatedDurationMinutes;
      template = await WorkoutTemplate.findOne({
        where: whereClause,
        order: [["id", "ASC"]],
      });
    }

    if (!template) {
      template = await WorkoutTemplate.findOne({
        where: {
          split: whereClause.split,
          fitnessLevel: whereClause.fitnessLevel,
          location: whereClause.location,
          category: whereClause.category,
          isRestDay: false,
        },
        order: [["id", "ASC"]],
      });
    }

    if (!template) {
      return {
        dateAssigned,
        restDay: false,
        workoutHistoryId: null,
        template: null,
      };
    }

    const history = await WorkoutHistory.create({
      userId: user.id,
      workoutTemplateId: template.id,
      dateAssigned,
      completed: false,
    });

    await this._ensureHistoryExercisesFromTemplate(history.id, template.id);

    const hydrated = await WorkoutTemplate.findByPk(template.id, {
      include: [
        {
          model: Exercise,
          through: {
            attributes: ["orderIndex", "sets", "reps", "restSeconds", "notes"],
          },
          include: [
            { model: Gallery, required: false },
            { model: Instruction, required: false },
          ],
        },
      ],
    });

    const payload = hydrated?.toJSON?.() || template.toJSON();
    if (payload?.Exercises) {
      payload.Exercises.sort(
        (a, b) =>
          (a.WorkoutTemplateExercise?.orderIndex ?? 0) -
          (b.WorkoutTemplateExercise?.orderIndex ?? 0)
      );
    }

    const progressRows = await WorkoutHistoryExercise.findAll({
      where: { workoutHistoryId: history.id },
      order: [["orderIndex", "ASC"]],
    });

    return {
      dateAssigned,
      restDay: false,
      workoutHistoryId: history.id,
      template: payload,
      exerciseProgress: progressRows.map((row) => row.toJSON()),
    };
  }

  async listWorkoutHistoryForUser(user, options = {}) {
    const limit = Number(options.limit) || 30;
    const offset = Number(options.offset) || 0;

    const histories = await WorkoutHistory.findAll({
      where: { userId: user.id },
      order: [
        ["dateAssigned", "DESC"],
        ["id", "DESC"],
      ],
      limit,
      offset,
      include: [{ model: WorkoutTemplate, required: true }],
    });

    return histories.map((h) => h.toJSON());
  }

  /**
   * Returns a single workout history session with detailed exercise progress.
   *
   * Unlike `/workouts/today`, this includes nested `Exercise` + media inside `exerciseProgress`.
   */
  async getWorkoutHistoryDetailForUser(user, workoutHistoryId) {
    const history = await WorkoutHistory.findOne({
      where: { id: workoutHistoryId, userId: user.id },
      include: [{ model: WorkoutTemplate, required: true }],
    });
    if (!history) return null;

    await this._ensureHistoryExercisesFromTemplate(
      history.id,
      history.workoutTemplateId
    );

    const progressRows = await WorkoutHistoryExercise.findAll({
      where: { workoutHistoryId: history.id },
      order: [["orderIndex", "ASC"]],
      include: [
        {
          model: Exercise,
          required: true,
          include: [
            { model: Gallery, required: false },
            { model: Instruction, required: false },
          ],
        },
      ],
    });

    return {
      ...history.toJSON(),
      exerciseProgress: progressRows.map((row) => row.toJSON()),
    };
  }

  /**
   * Marks a workout history as completed if all exercises are completed.
   *
   * Returns `{ status }`:
   * - `ok`: completed successfully
   * - `already_done`: already completed
   * - `bad_request`: invalid id or workout not completed
   * - `not_found`: history not found for user
   */
  async finishWorkoutHistoryForUser(user, workoutHistoryId) {
    const id = Number(workoutHistoryId);
    if (!Number.isFinite(id)) {
      return { status: "bad_request", message: "invalid_workoutHistoryId" };
    }

    const history = await WorkoutHistory.findOne({
      where: { id, userId: user.id },
      include: [{ model: WorkoutTemplate, required: true }],
    });
    if (!history) return { status: "not_found" };

    if (history.completed) return { status: "already_done" };

    await this._ensureHistoryExercisesFromTemplate(
      id,
      history.workoutTemplateId
    );
    const stats = await this._getWorkoutHistoryExerciseCompletion(id);

    if (!stats.allCompleted && !history.WorkoutTemplate?.isRestDay) {
      return { status: "bad_request", message: "workout_not_completed" };
    }

    await history.update({ completed: true });
    return { status: "ok", data: history.toJSON() };
  }

  async updateWorkoutHistoryExerciseForUser(
    user,
    workoutHistoryId,
    exerciseId,
    patch
  ) {
    const history = await WorkoutHistory.findOne({
      where: { id: workoutHistoryId, userId: user.id },
      raw: true,
    });
    if (!history) return { status: "not_found" };

    await this._ensureHistoryExercisesFromTemplate(
      workoutHistoryId,
      history.workoutTemplateId
    );

    const row = await WorkoutHistoryExercise.findOne({
      where: { workoutHistoryId, exerciseId },
    });
    if (!row) return { status: "not_found" };

    const updates = {};

    if (patch?.performedSets !== undefined) {
      const normalized = this._normalizePerformedSets(patch.performedSets);
      if (!normalized)
        return { status: "bad_request", message: "invalid_performedSets" };
      updates.performedSets = normalized;
    }

    if (patch?.completed !== undefined) {
      updates.completed = Boolean(patch.completed);
    }

    await row.update(updates);

    if (patch?.completed !== undefined) {
      await this._syncWorkoutHistoryCompletion(workoutHistoryId);
    }
    return { status: "ok", data: row.toJSON() };
  }

  /**
   * One-off utility to import exercises/media from `public/exercises` into the DB.
   *
   * Used by seed scripts during initial setup.
   */
  async saveExercisesToDatabase() {
    let errorCount = 0;
    const exercisesDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "exercises"
    );
    const exerciseFolders = fs.readdirSync(exercisesDir).filter((folder) => {
      return fs.statSync(path.join(exercisesDir, folder)).isDirectory();
    });

    for (const folder of exerciseFolders) {
      const exerciseFolderPath = path.join(exercisesDir, folder);
      const exerciseJsonPath = path.join(exerciseFolderPath, "exercise.json");
      const imagesFolderPath = path.join(exerciseFolderPath, "images");

      if (fs.existsSync(exerciseJsonPath) && fs.existsSync(imagesFolderPath)) {
        const exerciseData = JSON.parse(
          fs.readFileSync(exerciseJsonPath, "utf-8")
        );

        // Get the image files from the images folder (assuming only two images)
        const imageFiles = fs.readdirSync(imagesFolderPath).filter((file) => {
          return /\.(jpg|jpeg|png|gif)$/i.test(file); // Make sure it's an image
        });

        // Prepare the image URLs (served from `/public/exercises/...` if you expose `public` statically)
        const imageUrls = imageFiles.map(
          (imageFile) => `/exercises/${folder}/images/${imageFile}`
        );

        // Prepare the data for saving
        const exercise = {
          name: exerciseData.name || folder,
          force: exerciseData.force,
          level: exerciseData.level,
          mechanic: exerciseData.mechanic,
          equipment: exerciseData.equipment,
          primaryMuscles: exerciseData.primaryMuscles,
          secondaryMuscles: exerciseData.secondaryMuscles,
          category: exerciseData.category,
        };

        try {
          // Check if the exercise already exists in the database
          const existingExercise = await Exercise.findOne({
            where: { name: exerciseData.name },
          });

          let savedExercise;

          if (!existingExercise) {
            // Save new exercise to the database
            savedExercise = await Exercise.create(exercise);
            console.log(`Exercise "${exerciseData.name}" saved successfully.`);
          } else {
            // Exercise exists, keep it up-to-date (idempotent seed)
            savedExercise = await existingExercise.update(exercise);
            console.log(
              `Exercise "${exerciseData.name}" updated successfully.`
            );
          }

          const instructionTexts = Array.isArray(exerciseData.instructions)
            ? exerciseData.instructions
                .map((text) => String(text ?? "").trim())
                .filter(Boolean)
            : [];

          await Instruction.destroy({
            where: { ExerciseId: savedExercise.id },
          });
          if (instructionTexts.length) {
            await Instruction.bulkCreate(
              instructionTexts.map((text) => ({
                text,
                ExerciseId: savedExercise.id,
              }))
            );
          }

          // Save images for the exercise (Gallery belongsTo Exercise)
          for (const imageUrl of imageUrls) {
            await Gallery.findOrCreate({
              where: {
                exerciseId: savedExercise.id,
                link: imageUrl,
                type: "image",
              },
              defaults: {
                exerciseId: savedExercise.id,
                link: imageUrl,
                type: "image",
              },
            });
          }

          // Optional: Add support for videos in the future
          // You can implement logic to check for videos here when you're ready
        } catch (err) {
          errorCount += 1;
          console.error(`Error saving exercise "${exerciseData.name}": `, err);
        }
      }
    }

    if (errorCount > 0) {
      throw new Error(
        `saveExercisesToDatabase completed with ${errorCount} error(s).`
      );
    }
  }
}

module.exports = WorkoutService;

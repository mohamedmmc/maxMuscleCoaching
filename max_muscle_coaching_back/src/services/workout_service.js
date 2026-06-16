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
const Muscle = require("../models/muscle_model");
const ExerciseMuscle = require("../models/exercise_muscle_model");
const Instruction = require("../models/instruction_model");
const Gallery = require("../models/gallery_model");
const User = require("../models/user_model");
const logger = require("../helper/logger");
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
    workoutTemplateId,
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
    if (typeof date === "string") {
      // Already a YYYY-MM-DD (Sequelize DATEONLY returns strings) — slice & return.
      return date.length >= 10 ? date.slice(0, 10) : date;
    }
    return date.toISOString().slice(0, 10);
  }

  _normalizeKey(value) {
    if (typeof value !== "string") return "";
    return value.trim().toLowerCase();
  }

  _normalizeFitnessLevel(value) {
    const level = this._normalizeKey(value);
    if (!level) return "Beginner";
    if (level.startsWith("beg")) return "Beginner";
    if (level.startsWith("int")) return "Intermediate";
    if (
      level.startsWith("adv") ||
      level.startsWith("exp") ||
      level === "expert" ||
      level === "pro"
    )
      return "Advanced";
    return "Beginner";
  }

  _normalizeLocation(value) {
    const location = this._normalizeKey(value);
    if (!location) return "Gym";
    if (location.startsWith("home")) return "Home";
    if (location.startsWith("gym")) return "Gym";
    return "Gym";
  }

  _normalizeSplit(value) {
    const split = this._normalizeKey(value);
    if (!split) return "Push/Pull/Legs";

    const compact = split.replace(/[^a-z]/g, "");

    if (
      compact === "ppl" ||
      compact === "pushpulllegs" ||
      compact.includes("pushpulllegs")
    ) {
      return "Push/Pull/Legs";
    }
    if (compact === "upperlower" || compact.includes("upperlower")) {
      return "Upper/Lower";
    }
    if (compact === "fullbody" || compact.includes("fullbody")) {
      return "Full Body";
    }
    if (
      compact === "brosplit" ||
      compact.includes("brosplit") ||
      compact === "bro"
    ) {
      return "Bro Split";
    }

    return "Push/Pull/Legs";
  }

  _candidateFitnessLevels(value) {
    const normalized = this._normalizeFitnessLevel(value);
    if (normalized === "Advanced")
      return ["Advanced", "Intermediate", "Beginner"];
    if (normalized === "Intermediate") return ["Intermediate", "Beginner"];
    return ["Beginner"];
  }

  _candidateLocations(value) {
    const normalized = this._normalizeLocation(value);
    if (normalized === "Home") return ["Home", "Gym"];
    if (normalized === "Gym") return ["Gym", "Home"];
    return ["Gym"];
  }

  async _getOrCreateRestDayTemplate() {
    const existing = await WorkoutTemplate.findOne({
      where: { isRestDay: true },
      order: [["id", "ASC"]],
    });
    if (existing) return existing;

    return WorkoutTemplate.create({
      name: "Rest Day - Mobility & Stretching",
      dayOfWeek: "Any",
      category: "Rest",
      split: "Any",
      fitnessLevel: "Any",
      location: "Any",
      focus: "Rest & Recovery",
      estimatedDurationMinutes: 0,
      isRestDay: true,
    });
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
    switch (this._normalizeSplit(split)) {
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

  _pickCategoryForToday({ split, daysPerWeek, dayIndex, isFirstSession = false }) {
    const trainingDays = this._trainingDaysForDaysPerWeek(daysPerWeek);
    const categories = this._categoriesForSplit(split);

    if (!trainingDays.includes(dayIndex)) {
      // First session must never be a rest day — kick off with the first training day's category.
      if (isFirstSession) return categories[0];
      return null;
    }

    const idxInTraining = trainingDays.indexOf(dayIndex);
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
   * Auto-completes `WorkoutHistory.completed` once all exercises are completed.
   * This never unsets `completed` back to false.
   */
  async _syncWorkoutHistoryCompletion(workoutHistoryId) {
    const stats =
      await this._getWorkoutHistoryExerciseCompletion(workoutHistoryId);

    // Once a workout history is marked completed (manual finish or auto-complete),
    // do not unset it back to false if the user later edits exercise completion.
    if (stats.allCompleted) {
      const [updatedCount] = await WorkoutHistory.update(
        { completed: true },
        { where: { id: workoutHistoryId, completed: false } },
      );
      if (updatedCount > 0) {
        const history = await WorkoutHistory.findByPk(workoutHistoryId, {
          attributes: ["userId", "dateAssigned"],
        });
        if (history) {
          await this._updateUserStreak(history.userId, history.dateAssigned);
        }
      }
    }

    return stats;
  }

  /**
   * Updates the user's streak when a workout completes.
   *
   * - Same calendar day as last completion: no change.
   * - Exactly +1 day vs last completion: streak += 1.
   * - Gap > 1 day: streak resets to 1.
   * - Earlier than last completion (back-fill): no change.
   *
   * `longestStreak` is monotonically non-decreasing.
   */
  async _updateUserStreak(userId, completionDate) {
    const completionDateOnly = this._dateOnly(completionDate);
    const user = await User.findByPk(userId);
    if (!user) return;

    const lastDate = user.lastWorkoutDate
      ? this._dateOnly(user.lastWorkoutDate)
      : null;

    if (lastDate === completionDateOnly) return;

    let newCurrent;
    if (!lastDate) {
      newCurrent = 1;
    } else {
      const diffDays = Math.round(
        (new Date(completionDateOnly + "T00:00:00") -
          new Date(lastDate + "T00:00:00")) /
          86400000,
      );
      if (diffDays === 1) newCurrent = (user.currentStreak || 0) + 1;
      else if (diffDays > 1) newCurrent = 1;
      else return; // back-filling a past workout — leave streak alone
    }

    const newLongest = Math.max(user.longestStreak || 0, newCurrent);
    await user.update({
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastWorkoutDate: completionDateOnly,
    });
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

    const split = this._normalizeSplit(user.split);
    const fitnessLevel = this._normalizeFitnessLevel(user.fitnessLevel);
    const location = this._normalizeLocation(user.location);
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
                {
                  model: Muscle,
                  as: "primaryMuscles",
                  through: { attributes: [] },
                  required: false,
                },
                {
                  model: Muscle,
                  as: "secondaryMuscles",
                  through: { attributes: [] },
                  required: false,
                },
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
            (b.WorkoutTemplateExercise?.orderIndex ?? 0),
        );
      }
      return json;
    });
  }

  /**
   * Returns (or creates) today's workout session for a user.
   *
   * If today's session is already completed (finished/validated), returns:
   * `{ message: "work_already_done", dateAssigned, workoutHistoryId }`.
   */
  async getTodayWorkoutForUser(user) {
    const today = new Date();

    const dateAssigned = this._dateOnly(today);

    const existing = await WorkoutHistory.findOne({
      where: { userId: user.id, dateAssigned },
      include: [{ model: WorkoutTemplate, required: true }],
    });
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
        existing.workoutTemplateId,
      );

      const stats = await this._getWorkoutHistoryExerciseCompletion(
        existing.id,
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
                {
                  model: Muscle,
                  as: "primaryMuscles",
                  through: { attributes: [] },
                  required: false,
                },
                {
                  model: Muscle,
                  as: "secondaryMuscles",
                  through: { attributes: [] },
                  required: false,
                },
              ],
            },
          ],
        },
      );

      const payload =
        template?.toJSON?.() || existing.WorkoutTemplate?.toJSON?.();
      if (payload?.Exercises) {
        payload.Exercises.sort(
          (a, b) =>
            (a.WorkoutTemplateExercise?.orderIndex ?? 0) -
            (b.WorkoutTemplateExercise?.orderIndex ?? 0),
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

    const split = this._normalizeSplit(user.split);
    const fitnessLevel = this._normalizeFitnessLevel(user.fitnessLevel);
    const location = this._normalizeLocation(user.location);

    const priorHistoryCount = await WorkoutHistory.count({
      where: { userId: user.id },
    });
    const isFirstSession = priorHistoryCount === 0;

    const dayIndex = today.getDay();
    const category = this._pickCategoryForToday({
      split,
      daysPerWeek: user.daysPerWeek,
      dayIndex,
      isFirstSession,
    });

    if (!category) {
      const restTemplate = await this._getOrCreateRestDayTemplate();
      const [history] = await WorkoutHistory.findOrCreate({
        where: { userId: user.id, dateAssigned },
        defaults: {
          workoutTemplateId: restTemplate.id,
          completed: false,
        },
      });
      await this._ensureHistoryExercisesFromTemplate(
        history.id,
        history.workoutTemplateId,
      );

      return {
        dateAssigned,
        restDay: true,
        workoutHistoryId: history.id,
        template: restTemplate.toJSON(),
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

    const fitnessLevelCandidates = this._candidateFitnessLevels(fitnessLevel);
    const locationCandidates = this._candidateLocations(location);

    const durationClause = user.sessionDurationMinutes
      ? {
          estimatedDurationMinutes: {
            [Op.between]: [
              Math.max(0, user.sessionDurationMinutes - 15),
              user.sessionDurationMinutes + 15,
            ],
          },
        }
      : {};

    const baseWhere = {
      split,
      category,
      isRestDay: false,
    };

    const tryFindTemplate = async (extraWhere) => {
      const candidate = await WorkoutTemplate.findOne({
        where: { ...baseWhere, ...extraWhere },
        order: [["id", "ASC"]],
      });
      if (!candidate) return null;

      const plannedCount = await WorkoutTemplateExercise.count({
        where: { workoutTemplateId: candidate.id },
      });
      return plannedCount > 0 ? candidate : null;
    };

    let template = null;

    // 1) Strict match (avoid repeats + match duration)
    for (const lvl of fitnessLevelCandidates) {
      for (const loc of locationCandidates) {
        template = await tryFindTemplate({
          fitnessLevel: lvl,
          location: loc,
          ...(recentIds.length ? { id: { [Op.notIn]: recentIds } } : {}),
          ...durationClause,
        });
        if (template) break;
      }
      if (template) break;
    }

    // 2) Same, but ignore duration
    if (!template && Object.keys(durationClause).length) {
      for (const lvl of fitnessLevelCandidates) {
        for (const loc of locationCandidates) {
          template = await tryFindTemplate({
            fitnessLevel: lvl,
            location: loc,
            ...(recentIds.length ? { id: { [Op.notIn]: recentIds } } : {}),
          });
          if (template) break;
        }
        if (template) break;
      }
    }

    // 3) Allow repeats (ignore recentIds)
    if (!template) {
      for (const lvl of fitnessLevelCandidates) {
        for (const loc of locationCandidates) {
          template = await tryFindTemplate({
            fitnessLevel: lvl,
            location: loc,
            ...durationClause,
          });
          if (template) break;
        }
        if (template) break;
      }
    }

    // 4) Last resort: any template for this split/category (still non-rest)
    if (!template) {
      template = await tryFindTemplate({});
    }

    // 5) Absolute fallback: any non-rest template at all
    if (!template) {
      template = await WorkoutTemplate.findOne({
        where: { isRestDay: false },
        order: [["id", "ASC"]],
        include: [
          {
            model: Exercise,
            required: true,
            attributes: [],
            through: { attributes: [] },
          },
        ],
      });
    }

    // If we still can't find a workout, degrade to rest day (never return empty)
    if (!template) {
      const restTemplate = await this._getOrCreateRestDayTemplate();
      const [history] = await WorkoutHistory.findOrCreate({
        where: { userId: user.id, dateAssigned },
        defaults: {
          workoutTemplateId: restTemplate.id,
          completed: false,
        },
      });
      await this._ensureHistoryExercisesFromTemplate(
        history.id,
        history.workoutTemplateId,
      );
      return {
        dateAssigned,
        restDay: true,
        workoutHistoryId: history.id,
        template: restTemplate.toJSON(),
        exerciseProgress: [],
      };
    }

    const [history] = await WorkoutHistory.findOrCreate({
      where: { userId: user.id, dateAssigned },
      defaults: {
        workoutTemplateId: template.id,
        completed: false,
      },
    });

    await this._ensureHistoryExercisesFromTemplate(
      history.id,
      history.workoutTemplateId,
    );

    // Hydrate the template actually pinned to this session (handles the race
    // case where findOrCreate returned a row created by a concurrent request
    // with a different template).
    const hydrated = await WorkoutTemplate.findByPk(history.workoutTemplateId, {
      include: [
        {
          model: Exercise,
          through: {
            attributes: ["orderIndex", "sets", "reps", "restSeconds", "notes"],
          },
          include: [
            { model: Gallery, required: false },
            { model: Instruction, required: false },
            {
              model: Muscle,
              as: "primaryMuscles",
              through: { attributes: [] },
              required: false,
            },
            {
              model: Muscle,
              as: "secondaryMuscles",
              through: { attributes: [] },
              required: false,
            },
          ],
        },
      ],
    });

    const payload = hydrated?.toJSON?.() || template.toJSON();
    if (payload?.Exercises) {
      payload.Exercises.sort(
        (a, b) =>
          (a.WorkoutTemplateExercise?.orderIndex ?? 0) -
          (b.WorkoutTemplateExercise?.orderIndex ?? 0),
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

  async getWorkoutStatsForUser(user, options = {}) {
    const isDateOnly = (value) =>
      typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

    const clampInt = (value, { min, max, fallback }) => {
      const num = Number(value);
      if (!Number.isFinite(num)) return fallback;
      const intValue = Math.floor(num);
      if (intValue < min) return fallback;
      return Math.min(max, intValue);
    };

    const shiftDateOnly = (dateOnly, deltaDays) => {
      const date = new Date(`${dateOnly}T00:00:00.000Z`);
      if (Number.isNaN(date.getTime())) return null;
      date.setUTCDate(date.getUTCDate() + deltaDays);
      return this._dateOnly(date);
    };

    const endDate = isDateOnly(options.to)
      ? options.to
      : this._dateOnly(new Date());
    const days = clampInt(options.days, { min: 1, max: 365, fallback: 30 });
    const startDate =
      isDateOnly(options.from) ? options.from : shiftDateOnly(endDate, -(days - 1));

    const topMusclesLimit = clampInt(options.topMusclesLimit, {
      min: 1,
      max: 50,
      fallback: 10,
    });

    const histories = await WorkoutHistory.findAll({
      where: {
        userId: user.id,
        dateAssigned: { [Op.between]: [startDate, endDate] },
      },
      attributes: ["id", "workoutTemplateId", "dateAssigned", "completed", "createdAt", "updatedAt"],
      include: [
        {
          model: WorkoutTemplate,
          required: false,
          attributes: [
            "id",
            "name",
            "split",
            "category",
            "fitnessLevel",
            "location",
            "estimatedDurationMinutes",
            "isRestDay",
          ],
        },
      ],
      order: [
        ["dateAssigned", "ASC"],
        ["id", "ASC"],
      ],
    });

    const historyIds = histories.map((h) => h.id);

    const progressRows = historyIds.length
      ? await WorkoutHistoryExercise.findAll({
          where: { workoutHistoryId: { [Op.in]: historyIds } },
          attributes: [
            "workoutHistoryId",
            "exerciseId",
            "completed",
            "performedSets",
          ],
          raw: true,
        })
      : [];

    const progressByHistoryId = new Map();
    const exerciseIds = new Set();

    for (const row of progressRows) {
      if (row?.workoutHistoryId) {
        const list = progressByHistoryId.get(row.workoutHistoryId) || [];
        list.push(row);
        progressByHistoryId.set(row.workoutHistoryId, list);
      }
      if (row?.exerciseId) exerciseIds.add(row.exerciseId);
    }

    const exerciseIdList = Array.from(exerciseIds);
    const muscleLinks = exerciseIdList.length
      ? await ExerciseMuscle.findAll({
          where: { exerciseId: { [Op.in]: exerciseIdList } },
          attributes: ["exerciseId", "muscleId", "role"],
          include: [
            {
              model: Muscle,
              required: true,
              attributes: ["id", "name"],
            },
          ],
          raw: true,
        })
      : [];

    const musclesByExerciseId = new Map();
    for (const link of muscleLinks) {
      const exerciseId = link.exerciseId;
      const muscleId = link.muscleId;
      const role = link.role;
      const muscleName = link["Muscle.name"];
      if (!exerciseId || !muscleId || !muscleName || !role) continue;

      const list = musclesByExerciseId.get(exerciseId) || [];
      list.push({ id: muscleId, name: muscleName, role });
      musclesByExerciseId.set(exerciseId, list);
    }

    const normalizePerformedSets = (performedSets) => {
      if (Array.isArray(performedSets)) return performedSets;
      if (typeof performedSets === "string") {
        try {
          const parsed = JSON.parse(performedSets);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };

    const workoutPerformanceLabel = (completionRate) => {
      if (completionRate >= 1) return "perfect";
      if (completionRate >= 0.75) return "good";
      if (completionRate >= 0.5) return "ok";
      return "low";
    };

    const pointsForSession = ({ finished, restDay, exercisesCompleted, performedSetsCount }) => {
      if (!finished) return 0;
      const base = restDay ? 25 : 100;
      const exerciseBonus = Math.max(0, Number(exercisesCompleted) || 0) * 10;
      const setBonus = Math.max(0, Number(performedSetsCount) || 0) * 2;
      return base + exerciseBonus + setBonus;
    };

    const overallMuscleMap = new Map(); // muscleId -> { id, name, primaryExercises, secondaryExercises, days: Set<string> }

    const byDay = [];

    let sessionsTotal = histories.length;
    let sessionsFinished = 0;
    let workoutSessionsTotal = 0;
    let workoutSessionsFinished = 0;
    let restDaySessionsTotal = 0;
    let restDaySessionsFinished = 0;

    let exercisesTotal = 0;
    let exercisesCompleted = 0;
    let performedSetsTotal = 0;
    let performedRepsTotal = 0;
    let volumeTotal = 0;

    let estimatedDurationTotal = 0;
    let estimatedDurationCount = 0;
    let elapsedMinutesApproxTotal = 0;
    let elapsedMinutesApproxCount = 0;

    let pointsTotal = 0;

    for (const history of histories) {
      const template = history.WorkoutTemplate || null;
      const restDay = Boolean(template?.isRestDay);
      const finished = Boolean(history.completed);

      if (restDay) restDaySessionsTotal += 1;
      else workoutSessionsTotal += 1;

      if (finished) {
        sessionsFinished += 1;
        if (restDay) restDaySessionsFinished += 1;
        else workoutSessionsFinished += 1;
      }

      const rows = progressByHistoryId.get(history.id) || [];

      const dayExercisesTotal = rows.length;
      const dayExercisesCompleted = rows.filter((r) => Boolean(r.completed)).length;

      let dayPerformedSets = 0;
      let dayPerformedReps = 0;
      let dayVolume = 0;

      for (const row of rows) {
        const performedSets = normalizePerformedSets(row.performedSets);
        dayPerformedSets += performedSets.length;

        for (const set of performedSets) {
          const reps = Number(set?.reps);
          if (Number.isFinite(reps) && reps >= 0) {
            dayPerformedReps += reps;
            const weightRaw = set?.weight;
            const weight =
              weightRaw === undefined || weightRaw === null || weightRaw === ""
                ? null
                : Number(weightRaw);
            if (Number.isFinite(weight)) {
              dayVolume += reps * weight;
            }
          }
        }
      }

      exercisesTotal += dayExercisesTotal;
      exercisesCompleted += dayExercisesCompleted;
      performedSetsTotal += dayPerformedSets;
      performedRepsTotal += dayPerformedReps;
      volumeTotal += dayVolume;

      if (finished) {
        const estimated = Number(template?.estimatedDurationMinutes);
        if (Number.isFinite(estimated)) {
          estimatedDurationTotal += estimated;
          estimatedDurationCount += 1;
        }

        const startedAt = history.createdAt ? new Date(history.createdAt) : null;
        const finishedAt = history.updatedAt ? new Date(history.updatedAt) : null;
        if (startedAt && finishedAt) {
          const diffMs = finishedAt.getTime() - startedAt.getTime();
          const minutes = diffMs > 0 ? diffMs / 60000 : 0;
          if (Number.isFinite(minutes)) {
            elapsedMinutesApproxTotal += minutes;
            elapsedMinutesApproxCount += 1;
          }
        }
      }

      const completionRate =
        dayExercisesTotal > 0 ? dayExercisesCompleted / dayExercisesTotal : restDay ? 1 : 0;

      const muscleMap = new Map(); // muscleId -> { id, name, primaryExercises, secondaryExercises }
      for (const row of rows) {
        const muscles = musclesByExerciseId.get(row.exerciseId) || [];
        for (const muscle of muscles) {
          const entry = muscleMap.get(muscle.id) || {
            id: muscle.id,
            name: muscle.name,
            primaryExercises: 0,
            secondaryExercises: 0,
          };
          if (muscle.role === "primary") entry.primaryExercises += 1;
          else entry.secondaryExercises += 1;
          muscleMap.set(muscle.id, entry);

          const overall = overallMuscleMap.get(muscle.id) || {
            id: muscle.id,
            name: muscle.name,
            primaryExercises: 0,
            secondaryExercises: 0,
            days: new Set(),
          };
          if (muscle.role === "primary") overall.primaryExercises += 1;
          else overall.secondaryExercises += 1;
          overall.days.add(history.dateAssigned);
          overallMuscleMap.set(muscle.id, overall);
        }
      }

      const muscles = Array.from(muscleMap.values())
        .map((m) => ({
          ...m,
          score: m.primaryExercises * 2 + m.secondaryExercises,
        }))
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

      const points = pointsForSession({
        finished,
        restDay,
        exercisesCompleted: dayExercisesCompleted,
        performedSetsCount: dayPerformedSets,
      });
      pointsTotal += points;

      byDay.push({
        date: history.dateAssigned,
        workoutHistoryId: history.id,
        finished,
        restDay,
        template: template
          ? {
              id: template.id,
              name: template.name,
              split: template.split,
              category: template.category,
              fitnessLevel: template.fitnessLevel,
              location: template.location,
              estimatedDurationMinutes: template.estimatedDurationMinutes,
            }
          : null,
        metrics: {
          exercisesTotal: dayExercisesTotal,
          exercisesCompleted: dayExercisesCompleted,
          completionRate,
          performedSets: dayPerformedSets,
          performedReps: dayPerformedReps,
          volume: dayVolume,
          estimatedDurationMinutes: Number.isFinite(Number(template?.estimatedDurationMinutes))
            ? Number(template.estimatedDurationMinutes)
            : null,
          elapsedMinutesApprox:
            finished && history.createdAt && history.updatedAt
              ? Math.max(
                  0,
                  Math.round(
                    (new Date(history.updatedAt).getTime() -
                      new Date(history.createdAt).getTime()) /
                      60000,
                  ),
                )
              : null,
        },
        performance: restDay ? { label: "rest" } : { label: workoutPerformanceLabel(completionRate) },
        muscles,
        points,
      });
    }

    const topMuscles = Array.from(overallMuscleMap.values())
      .map((m) => ({
        id: m.id,
        name: m.name,
        primaryExercises: m.primaryExercises,
        secondaryExercises: m.secondaryExercises,
        score: m.primaryExercises * 2 + m.secondaryExercises,
        daysWorked: m.days.size,
      }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, topMusclesLimit);

    const averageOrNull = (total, count, decimals = 1) => {
      if (!count) return null;
      const value = total / count;
      const factor = 10 ** decimals;
      return Math.round(value * factor) / factor;
    };

    const levelFromPoints = (points) => Math.floor(Math.max(0, points) / 500) + 1;
    const nextLevelAt = (level) => level * 500;

    const rangeLevel = levelFromPoints(pointsTotal);

    const within = (date, start, end) => date >= start && date <= end;
    const summarizeWindow = (windowStart, windowEnd) => {
      const items = byDay.filter(
        (d) => within(d.date, windowStart, windowEnd) && d.finished && !d.restDay,
      );
      const sessions = items.length;
      const volume = items.reduce((sum, d) => sum + (Number(d.metrics?.volume) || 0), 0);
      const completionRate = averageOrNull(
        items.reduce((sum, d) => sum + (Number(d.metrics?.completionRate) || 0), 0),
        items.length,
        3,
      );
      return { sessions, volume, avgCompletionRate: completionRate };
    };

    const rolling7Start = shiftDateOnly(endDate, -6);
    const previous7Start = shiftDateOnly(endDate, -13);
    const previous7End = shiftDateOnly(endDate, -7);

    const rolling7 =
      rolling7Start ? summarizeWindow(rolling7Start, endDate) : { sessions: 0, volume: 0, avgCompletionRate: null };
    const previous7 =
      previous7Start && previous7End
        ? summarizeWindow(previous7Start, previous7End)
        : { sessions: 0, volume: 0, avgCompletionRate: null };

    const [allTimeSessionsTotal, allTimeSessionsFinished, allTimeWorkoutsFinished, allTimeRestDaysFinished, freshUser] =
      await Promise.all([
        WorkoutHistory.count({ where: { userId: user.id } }),
        WorkoutHistory.count({ where: { userId: user.id, completed: true } }),
        WorkoutHistory.count({
          where: { userId: user.id, completed: true },
          include: [{ model: WorkoutTemplate, required: true, where: { isRestDay: false } }],
        }),
        WorkoutHistory.count({
          where: { userId: user.id, completed: true },
          include: [{ model: WorkoutTemplate, required: true, where: { isRestDay: true } }],
        }),
        User.findByPk(user.id, {
          attributes: ["currentStreak", "longestStreak", "lastWorkoutDate"],
        }),
      ]);

    const streak = this._computeStreakView(freshUser);
    const personalRecords = await this.getPersonalRecordsForUser(user.id, { limit: 5 });

    const allTimePoints = allTimeWorkoutsFinished * 100 + allTimeRestDaysFinished * 25;
    const allTimeLevel = levelFromPoints(allTimePoints);

    return {
      range: { startDate, endDate, days },
      summary: {
        sessionsTotal,
        sessionsFinished,
        workoutSessionsTotal,
        workoutSessionsFinished,
        restDaySessionsTotal,
        restDaySessionsFinished,
        exercisesTotal,
        exercisesCompleted,
        exerciseCompletionRate: exercisesTotal ? exercisesCompleted / exercisesTotal : 0,
        performedSetsTotal,
        performedRepsTotal,
        volumeTotal,
        avgEstimatedDurationMinutes: averageOrNull(
          estimatedDurationTotal,
          estimatedDurationCount,
          1,
        ),
        avgElapsedMinutesApprox: averageOrNull(
          elapsedMinutesApproxTotal,
          elapsedMinutesApproxCount,
          1,
        ),
      },
      gamification: {
        points: pointsTotal,
        level: rangeLevel,
        nextLevelAt: nextLevelAt(rangeLevel),
        progressToNextLevel: nextLevelAt(rangeLevel) - pointsTotal,
      },
      allTime: {
        sessionsTotal: Number(allTimeSessionsTotal) || 0,
        sessionsFinished: Number(allTimeSessionsFinished) || 0,
        workoutsFinished: Number(allTimeWorkoutsFinished) || 0,
        restDaysFinished: Number(allTimeRestDaysFinished) || 0,
        points: allTimePoints,
        level: allTimeLevel,
        nextLevelAt: nextLevelAt(allTimeLevel),
        progressToNextLevel: nextLevelAt(allTimeLevel) - allTimePoints,
      },
      trends: {
        rolling7,
        previous7,
        delta: {
          sessions: rolling7.sessions - previous7.sessions,
          volume: rolling7.volume - previous7.volume,
        },
      },
      streak,
      personalRecords,
      topMuscles,
      byDay,
    };
  }

  /**
   * Returns the user's top personal records (heaviest weight ever lifted per exercise).
   *
   * Only counts sets logged in completed workout histories where weight > 0 and reps > 0
   * (skips bodyweight exercises with no tracked weight).
   *
   * Each entry: `{ exerciseId, name, weight, reps, dateAchieved }`.
   */
  async getPersonalRecordsForUser(userId, { limit = 5 } = {}) {
    const histories = await WorkoutHistory.findAll({
      where: { userId, completed: true },
      attributes: ["id", "dateAssigned"],
      raw: true,
    });
    if (!histories.length) return [];

    const historyIds = histories.map((h) => h.id);
    const dateById = new Map(
      histories.map((h) => [h.id, this._dateOnly(h.dateAssigned)]),
    );

    const progress = await WorkoutHistoryExercise.findAll({
      where: { workoutHistoryId: { [Op.in]: historyIds } },
      attributes: ["exerciseId", "workoutHistoryId", "performedSets"],
      include: [
        {
          model: Exercise,
          attributes: ["id", "name"],
          required: true,
        },
      ],
    });

    const parseSets = (raw) => {
      if (Array.isArray(raw)) return raw;
      if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };

    const prByExerciseId = new Map();
    for (const row of progress) {
      const sets = parseSets(row.performedSets);
      for (const set of sets) {
        const weight = Number(set?.weight);
        const reps = Number(set?.reps);
        if (!Number.isFinite(weight) || weight <= 0) continue;
        if (!Number.isFinite(reps) || reps <= 0) continue;

        const existing = prByExerciseId.get(row.exerciseId);
        if (!existing || weight > existing.weight) {
          prByExerciseId.set(row.exerciseId, {
            exerciseId: row.exerciseId,
            name: row.Exercise?.name || `Exercise ${row.exerciseId}`,
            weight,
            reps,
            dateAchieved: dateById.get(row.workoutHistoryId) || null,
          });
        }
      }
    }

    return Array.from(prByExerciseId.values())
      .sort((a, b) => b.weight - a.weight)
      .slice(0, Math.max(1, Number(limit) || 5));
  }

  /**
   * Returns a frontend-friendly view of the user's streak:
   * - `current`: live streak (0 if user hasn't completed a workout today or yesterday)
   * - `stored`: raw value from User row (useful for debugging / "you broke a 12-day streak")
   * - `longest`: all-time longest
   * - `lastWorkoutDate`: ISO date or null
   * - `isActive`: whether the streak is still alive
   */
  _computeStreakView(userRow) {
    if (!userRow) return { current: 0, stored: 0, longest: 0, lastWorkoutDate: null, isActive: false };

    const stored = Number(userRow.currentStreak) || 0;
    const longest = Number(userRow.longestStreak) || 0;
    const lastDate = userRow.lastWorkoutDate
      ? this._dateOnly(userRow.lastWorkoutDate)
      : null;

    let isActive = false;
    if (lastDate) {
      const today = this._dateOnly();
      const diffDays = Math.round(
        (new Date(today + "T00:00:00") - new Date(lastDate + "T00:00:00")) / 86400000,
      );
      isActive = diffDays <= 1;
    }

    return {
      current: isActive ? stored : 0,
      stored,
      longest,
      lastWorkoutDate: lastDate,
      isActive,
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
      history.workoutTemplateId,
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
            {
              model: Muscle,
              as: "primaryMuscles",
              through: { attributes: [] },
              required: false,
            },
            {
              model: Muscle,
              as: "secondaryMuscles",
              through: { attributes: [] },
              required: false,
            },
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
   * Marks a workout history as completed (validated), even if not all exercises are completed.
   *
   * Returns `{ status }`:
   * - `ok`: completed successfully
   * - `already_done`: already completed
   * - `bad_request`: invalid id
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
      history.workoutTemplateId,
    );

    await history.update({ completed: true });
    await this._updateUserStreak(user.id, history.dateAssigned);
    const freshUser = await User.findByPk(user.id, {
      attributes: ["currentStreak", "longestStreak", "lastWorkoutDate"],
    });
    return {
      status: "ok",
      data: history.toJSON(),
      streak: this._computeStreakView(freshUser),
    };
  }

  async updateWorkoutHistoryExerciseForUser(
    user,
    workoutHistoryId,
    exerciseId,
    patch,
  ) {
    const history = await WorkoutHistory.findOne({
      where: { id: workoutHistoryId, userId: user.id },
      raw: true,
    });
    if (!history) return { status: "not_found" };

    await this._ensureHistoryExercisesFromTemplate(
      workoutHistoryId,
      history.workoutTemplateId,
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
    const muscleCache = new Map();
    const normalizeMuscleName = (value) => {
      if (typeof value !== "string") return "";
      const trimmed = value.trim();
      return trimmed ? trimmed.toLowerCase() : "";
    };

    const ensureMuscle = async (name) => {
      const normalized = normalizeMuscleName(name);
      if (!normalized) return null;
      if (muscleCache.has(normalized)) return muscleCache.get(normalized);

      const [muscle] = await Muscle.findOrCreate({
        where: { name: normalized },
        defaults: { name: normalized },
      });
      muscleCache.set(normalized, muscle);
      return muscle;
    };

    const exercisesDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "exercises",
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
          fs.readFileSync(exerciseJsonPath, "utf-8"),
        );

        // Get the image files from the images folder (assuming only two images)
        const imageFiles = fs.readdirSync(imagesFolderPath).filter((file) => {
          return /\.(jpg|jpeg|png|gif)$/i.test(file); // Make sure it's an image
        });

        // Prepare the image URLs (served from `/public/exercises/...` if you expose `public` statically)
        const imageUrls = imageFiles.map(
          (imageFile) => `/exercises/${folder}/images/${imageFile}`,
        );

        // Prepare the data for saving
        const exercise = {
          name: exerciseData.name || folder,
          force: exerciseData.force,
          level: exerciseData.level,
          mechanic: exerciseData.mechanic,
          equipment: exerciseData.equipment,
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
            logger.info({ exercise: exerciseData.name }, "exercise seeded");
          } else {
            // Exercise exists, keep it up-to-date (idempotent seed)
            savedExercise = await existingExercise.update(exercise);
            logger.info({ exercise: exerciseData.name }, "exercise updated");
          }

          const primaryMuscleNames = Array.isArray(exerciseData.primaryMuscles)
            ? exerciseData.primaryMuscles
                .map(normalizeMuscleName)
                .filter(Boolean)
            : [];
          const secondaryMuscleNames = Array.isArray(
            exerciseData.secondaryMuscles,
          )
            ? exerciseData.secondaryMuscles
                .map(normalizeMuscleName)
                .filter(Boolean)
            : [];
          const primaryMuscleSet = new Set(primaryMuscleNames);
          const uniqueSecondaryMuscleNames = [
            ...new Set(
              secondaryMuscleNames.filter(
                (name) => !primaryMuscleSet.has(name),
              ),
            ),
          ];

          const muscleRows = [];
          for (const name of primaryMuscleNames) {
            const muscle = await ensureMuscle(name);
            if (!muscle) continue;
            muscleRows.push({
              exerciseId: savedExercise.id,
              muscleId: muscle.id,
              role: "primary",
            });
          }
          for (const name of uniqueSecondaryMuscleNames) {
            const muscle = await ensureMuscle(name);
            if (!muscle) continue;
            muscleRows.push({
              exerciseId: savedExercise.id,
              muscleId: muscle.id,
              role: "secondary",
            });
          }

          await ExerciseMuscle.destroy({
            where: { exerciseId: savedExercise.id },
          });
          if (muscleRows.length) {
            await ExerciseMuscle.bulkCreate(muscleRows, {
              ignoreDuplicates: true,
            });
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
              })),
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
          logger.error({ err, exercise: exerciseData.name }, "failed to save exercise");
        }
      }
    }

    if (errorCount > 0) {
      throw new Error(
        `saveExercisesToDatabase completed with ${errorCount} error(s).`,
      );
    }
  }
}

module.exports = WorkoutService;

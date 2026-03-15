/**
 * Seed script: mock workout history progress for a user.
 *
 * Creates ~N months of workout histories for Mon–Fri (5 days/week),
 * and inserts per-exercise progress rows based on the selected template.
 *
 * Usage:
 *   node src/seed/mock_workout_history_seed.js --userId=1 --months=3
 *
 * Notes:
 * - Deletes existing histories for the user in the generated date range.
 * - Sets `WorkoutHistory.completed = true` (finished/validated) for all inserted days.
 */
require("dotenv").config();

const { sequelize } = require("../config/db.config");
const { Op } = require("sequelize");

function parseArgInt(name, fallback) {
  const prefix = `--${name}=`;
  const raw = process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
  const value = Number(raw);
  return Number.isFinite(value) ? Math.floor(value) : fallback;
}

function parseArgBool(name, fallback = false) {
  const flag = `--${name}`;
  if (process.argv.includes(flag)) return true;
  const prefix = `--${name}=`;
  const raw = process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
  if (raw === undefined) return fallback;
  return ["1", "true", "yes", "y"].includes(String(raw).toLowerCase());
}

function dateOnlyUTC(date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysUTC(date, days) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function monthsAgoUTC(months, now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}

function hashStringToUint32(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

async function loadModelsAndAssociations() {
  const User = require("../models/user_model");
  const Exercise = require("../models/exercise_model");
  const Muscle = require("../models/muscle_model");
  const ExerciseMuscle = require("../models/exercise_muscle_model");
  require("../models/instruction_model");
  require("../models/gallery_model");
  const WorkoutTemplate = require("../models/workout_template_model");
  const WorkoutTemplateExercise = require("../models/workout_template_exercise_model");
  const WorkoutHistory = require("../models/workout_history_model");
  const WorkoutHistoryExercise = require("../models/workout_history_exercise_model");

  if (User.associate) User.associate();
  if (Exercise.associate) Exercise.associate();
  if (Muscle.associate) Muscle.associate();
  if (ExerciseMuscle.associate) ExerciseMuscle.associate();
  if (WorkoutTemplate.associate) WorkoutTemplate.associate();
  if (WorkoutTemplateExercise.associate) WorkoutTemplateExercise.associate();
  if (WorkoutHistory.associate) WorkoutHistory.associate();
  if (WorkoutHistoryExercise.associate) WorkoutHistoryExercise.associate();

  return {
    Exercise,
    WorkoutTemplate,
    WorkoutTemplateExercise,
    WorkoutHistory,
    WorkoutHistoryExercise,
  };
}

async function main() {
  const userId = parseArgInt("userId", 1);
  const months = Math.max(1, Math.min(24, parseArgInt("months", 3)));
  const dryRun = parseArgBool("dryRun", false);

  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = monthsAgoUTC(months, end);

  const startDate = dateOnlyUTC(start);
  const endDate = dateOnlyUTC(end);

  const {
    Exercise,
    WorkoutTemplate,
    WorkoutTemplateExercise,
    WorkoutHistory,
    WorkoutHistoryExercise,
  } = await loadModelsAndAssociations();

  console.log(`Mock history seed for userId=${userId}`);
  console.log(`Range: ${startDate} → ${endDate} (Mon–Fri)`);
  if (dryRun) console.log("Mode: dry-run (no writes)");

  await sequelize.authenticate();

  const templates = await WorkoutTemplate.findAll({
    where: { isRestDay: false },
    attributes: ["id"],
    include: [
      {
        model: Exercise,
        required: true,
        attributes: [],
        through: { attributes: [] },
      },
    ],
    order: [["id", "ASC"]],
  });

  const templateIds = templates.map((t) => t.id).filter(Boolean);
  if (!templateIds.length) {
    throw new Error("No non-rest workout templates with exercises found.");
  }

  const dates = [];
  for (let d = new Date(`${startDate}T00:00:00.000Z`); d <= end; d = addDaysUTC(d, 1)) {
    const weekday = d.getUTCDay(); // 0 Sun ... 6 Sat
    if (weekday >= 1 && weekday <= 5) dates.push(dateOnlyUTC(d)); // Mon–Fri
  }

  const totalDays = Math.max(1, dates.length - 1);

  if (dryRun) {
    console.log(`Would insert ${dates.length} WorkoutHistories across ${templateIds.length} templates.`);
    return;
  }

  const result = await sequelize.transaction(async (transaction) => {
    const existingHistories = await WorkoutHistory.findAll({
      where: { userId, dateAssigned: { [Op.between]: [startDate, endDate] } },
      attributes: ["id"],
      raw: true,
      transaction,
    });
    const existingIds = existingHistories.map((h) => h.id);

    if (existingIds.length) {
      await WorkoutHistoryExercise.destroy({
        where: { workoutHistoryId: { [Op.in]: existingIds } },
        transaction,
      });
      await WorkoutHistory.destroy({
        where: { id: { [Op.in]: existingIds } },
        transaction,
      });
    }

    let insertedHistories = 0;
    let insertedExercises = 0;

    for (let i = 0; i < dates.length; i += 1) {
      const dateAssigned = dates[i];
      const templateId = templateIds[i % templateIds.length];

      const seed = hashStringToUint32(`${userId}|${dateAssigned}|${templateId}`);
      const rand = mulberry32(seed);

      const createdAt = new Date(`${dateAssigned}T18:00:00.000Z`);
      const durationMinutes = 35 + Math.floor(rand() * 40); // 35-74
      const updatedAt = new Date(createdAt.getTime() + durationMinutes * 60 * 1000);

      const history = await WorkoutHistory.create(
        {
          userId,
          workoutTemplateId: templateId,
          dateAssigned,
          completed: true,
          createdAt,
          updatedAt,
        },
        { transaction },
      );
      insertedHistories += 1;

      const planned = await WorkoutTemplateExercise.findAll({
        where: { workoutTemplateId: templateId },
        order: [["orderIndex", "ASC"]],
        raw: true,
        transaction,
      });

      const progressRatio = i / totalDays;
      const completionProb = 0.55 + 0.45 * progressRatio;

      const exerciseRows = planned.map((row) => {
        const exerciseSeed = hashStringToUint32(`${seed}|${row.exerciseId}|${row.orderIndex}`);
        const r = mulberry32(exerciseSeed);
        const completed = r() < completionProb;

        const plannedSets = row.sets ?? 3;
        const performedSets = [];

        if (completed) {
          const setCount = Number.isFinite(Number(plannedSets)) ? Number(plannedSets) : 3;
          const baseWeight = 20 + (Number(row.exerciseId) % 10) * 5;
          const progression = 1 + progressRatio * 0.25;

          for (let s = 1; s <= Math.max(1, setCount); s += 1) {
            const reps = 8 + Math.floor(r() * 5); // 8-12
            const weightMultiplier = 0.95 + r() * 0.1;
            const weight = Math.round(baseWeight * progression * weightMultiplier * 10) / 10;
            performedSets.push({ setNumber: s, reps, weight });
          }
        }

        return {
          workoutHistoryId: history.id,
          exerciseId: row.exerciseId,
          orderIndex: row.orderIndex ?? 1,
          plannedSets: row.sets ?? null,
          plannedReps: row.reps ?? null,
          plannedRestSeconds: row.restSeconds ?? null,
          plannedNotes: row.notes ?? null,
          performedSets: performedSets.length ? performedSets : [],
          completed,
          createdAt,
          updatedAt,
        };
      });

      if (exerciseRows.length) {
        await WorkoutHistoryExercise.bulkCreate(exerciseRows, { transaction });
        insertedExercises += exerciseRows.length;
      }
    }

    return { insertedHistories, insertedExercises, deletedHistories: existingIds.length };
  });

  console.log(
    `Done. Deleted histories: ${result.deletedHistories}, inserted histories: ${result.insertedHistories}, inserted exercises: ${result.insertedExercises}`,
  );
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}

module.exports = { main };

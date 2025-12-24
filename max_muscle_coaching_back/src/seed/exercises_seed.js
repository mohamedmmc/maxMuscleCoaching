/**
 * Seed script: exercises
 *
 * Imports exercises and their gallery images into the DB from `public/exercises`.
 *
 * Usage:
 * - `npm run seed:exercises`
 */
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("../config/db.config");
const Exercise = require("../models/exercise_model");
const Gallery = require("../models/gallery_model");
const WorkoutService = require("../services/workout_service");

async function run() {
  await sequelize.authenticate();
  // Ensure schema matches current Exercise model (notably: allow NULL for optional fields)
  await Exercise.sync({ alter: true });
  await Gallery.sync({ alter: true });

  const workoutService = new WorkoutService();
  await workoutService.saveExercisesToDatabase();
  await sequelize.close();
}

run()
  .then(() => {
    console.log("✅ Exercises seed completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Exercises seed failed:", err);
    process.exit(1);
  });

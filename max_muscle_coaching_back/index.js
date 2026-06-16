/**
 * Server entry point (used by `npm start`).
 *
 * Responsibilities:
 * - Load/register Sequelize models and associations
 * - Sync database schema (see `src/config/db_sync.js`)
 * - Register HTTP routes
 * - Start the HTTP server
 */

const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
const { green, yellow } = require("./src/helper/colors");
const { getFullDate } = require("./src/helper/time");
const { sequelize } = require("./src/config/db.config");
const { syncDatabase } = require("./src/config/db_sync");
const logger = require("./src/helper/logger");
dotenv.config();

// PORT
const PORT = process.env.PORT_RENTALS || 3001;

async function startServer() {
  // IMPORTANT: models must be imported/registered before calling `sequelize.sync()`
  const User = require("./src/models/user_model");
  const Exercise = require("./src/models/exercise_model");
  const Muscle = require("./src/models/muscle_model");
  const ExerciseMuscle = require("./src/models/exercise_muscle_model");

  require("./src/models/instruction_model");
  require("./src/models/gallery_model");
  const WorkoutTemplate = require("./src/models/workout_template_model");
  const WorkoutTemplateExercise = require("./src/models/workout_template_exercise_model");
  const WorkoutHistory = require("./src/models/workout_history_model");
  const WorkoutHistoryExercise = require("./src/models/workout_history_exercise_model");
  const BodyweightEntry = require("./src/models/bodyweight_entry_model");

  // Set up all model associations after models are loaded
  if (User.associate) User.associate();
  if (Exercise.associate) Exercise.associate();
  if (Muscle.associate) Muscle.associate();
  if (ExerciseMuscle.associate) ExerciseMuscle.associate();
  if (WorkoutTemplate.associate) WorkoutTemplate.associate();
  if (WorkoutTemplateExercise.associate) WorkoutTemplateExercise.associate();
  if (WorkoutHistory.associate) WorkoutHistory.associate();
  if (WorkoutHistoryExercise.associate) WorkoutHistoryExercise.associate();
  if (BodyweightEntry.associate) BodyweightEntry.associate();

  const { dropped } = await syncDatabase(sequelize);
  if (dropped.length) {
    logger.warn({ dropped }, "dropped legacy exercise history tables");
  }
  logger.info("db synced");

  require("./src/routes/user_route")(app);
  require("./src/routes/user_workout_route")(app);
  require("./src/routes/bodyweight_route")(app);

  const server = http.createServer(app);
  server.on("error", (err) => {
    logger.error({ err }, "failed to start server");
    process.exitCode = 1;
  });
  server.listen(PORT, () => {
    logger.info({ port: PORT, time: getFullDate() }, "server listening");
  });
}

startServer().catch((err) => {
  logger.error({ err }, "failed to start server");
});

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
dotenv.config();

// PORT
const PORT = process.env.PORT_RENTALS || 3001;

async function startServer() {
  // IMPORTANT: models must be imported/registered before calling `sequelize.sync()`
  const User = require("./src/models/user_model");
  const Exercise = require("./src/models/exercise_model");

  require("./src/models/instruction_model");
  require("./src/models/gallery_model");
  const WorkoutTemplate = require("./src/models/workout_template_model");
  const WorkoutTemplateExercise = require("./src/models/workout_template_exercise_model");
  const WorkoutHistory = require("./src/models/workout_history_model");
  const WorkoutHistoryExercise = require("./src/models/workout_history_exercise_model");

  // Set up all model associations after models are loaded
  if (User.associate) User.associate();
  if (Exercise.associate) Exercise.associate();
  if (WorkoutTemplate.associate) WorkoutTemplate.associate();
  if (WorkoutTemplateExercise.associate) WorkoutTemplateExercise.associate();
  if (WorkoutHistory.associate) WorkoutHistory.associate();
  if (WorkoutHistoryExercise.associate) WorkoutHistoryExercise.associate();

  const { dropped } = await syncDatabase(sequelize);
  if (dropped.length) {
    console.log(
      yellow(`Dropped legacy exercise history table(s): ${dropped.join(", ")}`)
    );
  }
  console.log(green("Synced db."));

  require("./src/routes/user_route")(app);
  require("./src/routes/user_workout_route")(app);

  const server = http.createServer(app);
  server.on("error", (err) => {
    console.error("Failed to start server: " + err.message);
    process.exitCode = 1;
  });
  server.listen(PORT, () => {
    console.log(green(`Server listening on port ${PORT} at ${getFullDate()}`));
  });
}

startServer().catch((err) => {
  console.error("Failed to start server: " + err.message);
});

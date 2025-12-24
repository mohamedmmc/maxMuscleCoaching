/**
 * Workout routes mounted under `/workouts`.
 *
 * Endpoints (all require `Authorization: Bearer <jwt>`):
 * - GET  `/workouts/recommended`
 * - GET  `/workouts/today`
 * - GET  `/workouts/history`
 * - GET  `/workouts/history/:workoutHistoryId`
 * - PUT  `/workouts/history/:workoutHistoryId/exercises/:exerciseId`
 * - POST `/workouts/history/:workoutHistoryId/finish`
 *
 * Detailed API docs: `docs/API.md`
 */
module.exports = (app) => {
  const router = require("express").Router();
  const controller = require("../controllers/user_workout_controller");
  const { tokenVerification } = require("../middlewares/authentificationHelper");

  // GET /workouts/recommended
  router.get("/recommended", tokenVerification, controller.recommended);
  // GET /workouts/today
  router.get("/today", tokenVerification, controller.today);
  // GET /workouts/history
  router.get("/history", tokenVerification, controller.history);
  // GET /workouts/history/:workoutHistoryId
  router.get("/history/:workoutHistoryId", tokenVerification, controller.historyDetail);
  // POST /workouts/history/:workoutHistoryId/finish
  router.post(
    "/history/:workoutHistoryId/finish",
    tokenVerification,
    controller.finishWorkout
  );
  // PUT /workouts/history/:workoutHistoryId/exercises/:exerciseId
  router.put(
    "/history/:workoutHistoryId/exercises/:exerciseId",
    tokenVerification,
    controller.updateExerciseProgress
  );

  app.use("/workouts", router);
};

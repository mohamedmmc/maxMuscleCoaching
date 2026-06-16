/**
 * Workout routes mounted under `/workouts`.
 *
 * Endpoints (all require `Authorization: Bearer <jwt>`):
 * - GET  `/workouts/recommended`
 * - GET  `/workouts/stats`
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
  const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

  // Per-user limiter: protects the read/write workout endpoints from a
  // single account hammering them (a /workouts/today loop creates one
  // history row per call). Keyed by user id so a busy office NAT doesn't
  // share quota across users.
  const perUserLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) =>
      req.decoded?.id
        ? `workouts:user:${req.decoded.id}`
        : `workouts:ip:${ipKeyGenerator(req.ip)}`,
    message: { message: "Too many requests, slow down a bit." },
  });

  router.use(tokenVerification, perUserLimiter);

  // GET /workouts/recommended
  router.get("/recommended", controller.recommended);
  // GET /workouts/stats
  router.get("/stats", controller.stats);
  // GET /workouts/today
  router.get("/today", controller.today);
  // GET /workouts/history
  router.get("/history", controller.history);
  // GET /workouts/history/:workoutHistoryId
  router.get("/history/:workoutHistoryId", controller.historyDetail);
  // POST /workouts/history/:workoutHistoryId/finish
  router.post(
    "/history/:workoutHistoryId/finish",
    controller.finishWorkout,
  );
  // PUT /workouts/history/:workoutHistoryId/exercises/:exerciseId
  router.put(
    "/history/:workoutHistoryId/exercises/:exerciseId",
    controller.updateExerciseProgress,
  );

  app.use("/workouts", router);
};

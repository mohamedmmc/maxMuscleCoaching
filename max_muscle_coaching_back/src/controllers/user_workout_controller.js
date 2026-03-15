/**
 * Workout HTTP controllers.
 *
 * These handlers assume `tokenVerification` has populated `req.decoded.id`.
 * Detailed endpoint docs: `docs/API.md`
 */
const WorkoutService = require("../services/workout_service");
const User = require("../models/user_model");

const workoutService = new WorkoutService();

/**
 * GET /workouts/recommended
 *
 * Returns recommended workout templates for the authenticated user.
 */
exports.recommended = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);

    if (!user) return res.status(401).json({ message: "invalid_token" });

    const templates = await workoutService.getRecommendedTemplatesForUser(user);
    return res.status(200).json({ userId: user.id, templates });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /workouts/stats
 *
 * Returns workout statistics for the authenticated user.
 *
 * Query params (optional):
 * - `from`: YYYY-MM-DD
 * - `to`: YYYY-MM-DD
 * - `days`: number (default 30)
 * - `topMusclesLimit`: number (default 10)
 */
exports.stats = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const isDateOnly = (value) =>
      typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

    const from = req.query?.from;
    const to = req.query?.to;
    if (from && !isDateOnly(from))
      return res.status(400).json({ message: "invalid_from" });
    if (to && !isDateOnly(to))
      return res.status(400).json({ message: "invalid_to" });
    if (from && to && from > to)
      return res.status(400).json({ message: "invalid_date_range" });

    const daysRaw = Number(req.query?.days);
    const days =
      Number.isFinite(daysRaw) && daysRaw > 0
        ? Math.min(365, Math.floor(daysRaw))
        : 30;

    const topMusclesLimitRaw = Number(req.query?.topMusclesLimit);
    const topMusclesLimit =
      Number.isFinite(topMusclesLimitRaw) && topMusclesLimitRaw > 0
        ? Math.min(50, Math.floor(topMusclesLimitRaw))
        : 10;

    const stats = await workoutService.getWorkoutStatsForUser(user, {
      from,
      to,
      days,
      topMusclesLimit,
    });

    return res.status(200).json({ userId: user.id, ...stats });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /workouts/today
 *
 * Returns (or creates) today's workout session.
 * If the user already finished today's session, returns `{ message: "work_already_done" }`.
 */
exports.today = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const workout = await workoutService.getTodayWorkoutForUser(user);
    return res.status(200).json(workout);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /workouts/history
 *
 * Lists workout history sessions for the authenticated user.
 * Supports `?limit=&offset=` pagination.
 */
exports.history = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const histories = await workoutService.listWorkoutHistoryForUser(user, {
      limit: req.query?.limit,
      offset: req.query?.offset,
    });

    return res.status(200).json({ userId: user.id, histories });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /workouts/history/:workoutHistoryId
 *
 * Returns one workout history session with detailed `exerciseProgress` (includes Exercise + media).
 */
exports.historyDetail = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const workoutHistoryId = Number(req.params.workoutHistoryId);
    if (!Number.isFinite(workoutHistoryId)) {
      return res.status(400).json({ message: "invalid_workoutHistoryId" });
    }

    const detail = await workoutService.getWorkoutHistoryDetailForUser(
      user,
      workoutHistoryId
    );
    if (!detail) return res.status(404).json({ message: "not_found" });

    return res.status(200).json({ userId: user.id, ...detail });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /workouts/history/:workoutHistoryId/exercises/:exerciseId
 *
 * Updates progress for one exercise:
 * - `performedSets`: array of performed sets
 * - `completed`: boolean
 *
 * When `completed` is updated, the server can auto-complete the workout history
 * once all exercises are completed.
 */
exports.updateExerciseProgress = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const workoutHistoryId = Number(req.params.workoutHistoryId);
    const exerciseId = Number(req.params.exerciseId);
    if (!Number.isFinite(workoutHistoryId) || !Number.isFinite(exerciseId)) {
      return res.status(400).json({ message: "invalid_params" });
    }

    const result = await workoutService.updateWorkoutHistoryExerciseForUser(
      user,
      workoutHistoryId,
      exerciseId,
      req.body
    );

    if (result.status === "bad_request") {
      return res.status(400).json({ message: result.message });
    }
    if (result.status === "not_found") {
      return res.status(404).json({ message: "not_found" });
    }

    return res.status(200).json({ userId: user.id, progress: result.data });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /workouts/history/:workoutHistoryId/finish
 *
 * Marks a workout history as finished (validated).
 * Returns `{ message: "work_already_done" }` if it was already finished.
 */
exports.finishWorkout = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const workoutHistoryId = Number(req.params.workoutHistoryId);
    if (!Number.isFinite(workoutHistoryId)) {
      return res.status(400).json({ message: "invalid_workoutHistoryId" });
    }

    const result = await workoutService.finishWorkoutHistoryForUser(
      user,
      workoutHistoryId
    );

    if (result.status === "bad_request") {
      return res.status(400).json({ message: result.message });
    }
    if (result.status === "not_found") {
      return res.status(404).json({ message: "not_found" });
    }
    if (result.status === "already_done") {
      return res.status(200).json({ message: "work_already_done" });
    }

    return res.status(200).json({
      userId: user.id,
      workoutHistoryId,
      completed: true,
    });
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", error);
    return res.status(500).json({ message: error.message });
  }
};

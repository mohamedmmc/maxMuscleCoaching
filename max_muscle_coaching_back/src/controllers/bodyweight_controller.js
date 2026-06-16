/**
 * Bodyweight tracking HTTP controllers.
 *
 * Routes mounted in `src/routes/bodyweight_route.js` under `/users/bodyweight`.
 */
const User = require("../models/user_model");
const BodyweightEntry = require("../models/bodyweight_entry_model");
const { Op } = require("sequelize");
const logger = require("../helper/logger");

/**
 * POST /users/bodyweight
 * Body: { weight: number, dateLogged?: "YYYY-MM-DD" }
 *
 * Logs a new bodyweight entry. Also updates `User.weight` to the latest value.
 */
exports.createEntry = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const weightNum = Number(req.body?.weight);
    if (!Number.isFinite(weightNum) || weightNum <= 0 || weightNum > 600) {
      return res.status(400).json({ message: "invalid_weight" });
    }

    const dateRaw = req.body?.dateLogged;
    const dateLogged =
      typeof dateRaw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)
        ? dateRaw
        : new Date().toISOString().slice(0, 10);

    const entry = await BodyweightEntry.create({
      userId: user.id,
      weight: weightNum,
      dateLogged,
    });

    await user.update({ weight: weightNum });

    return res.status(201).json({
      id: entry.id,
      userId: user.id,
      weight: weightNum,
      dateLogged,
    });
  } catch (error) {
    logger.error({ err: error }, "bodyweight controller error");
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /users/bodyweight?days=90
 *
 * Returns entries from the last `days` days (default 90, max 365),
 * ordered chronologically (oldest -> newest) for charting.
 */
exports.listEntries = async (req, res) => {
  try {
    const user = await User.findByPk(req.decoded.id);
    if (!user) return res.status(401).json({ message: "invalid_token" });

    const daysRaw = Number(req.query?.days);
    const days = Number.isFinite(daysRaw) && daysRaw > 0 ? Math.min(365, Math.floor(daysRaw)) : 90;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDateOnly = cutoff.toISOString().slice(0, 10);

    const entries = await BodyweightEntry.findAll({
      where: {
        userId: user.id,
        dateLogged: { [Op.gte]: cutoffDateOnly },
      },
      attributes: ["id", "weight", "dateLogged"],
      order: [["dateLogged", "ASC"], ["id", "ASC"]],
    });

    return res.status(200).json({
      data: entries.map((e) => ({
        id: e.id,
        weight: e.weight,
        dateLogged: e.dateLogged,
      })),
    });
  } catch (error) {
    logger.error({ err: error }, "bodyweight controller error");
    return res.status(500).json({ message: error.message });
  }
};

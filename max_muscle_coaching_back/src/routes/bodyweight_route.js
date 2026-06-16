/**
 * Bodyweight tracking routes mounted under `/users/bodyweight`.
 *
 * Endpoints:
 * - POST `/users/bodyweight`        — log a new entry (Bearer token)
 * - GET  `/users/bodyweight?days=N` — list entries (Bearer token)
 */
module.exports = (app) => {
  const bodyweightController = require("../controllers/bodyweight_controller");
  const { tokenVerification } = require("../middlewares/authentificationHelper");
  const router = require("express").Router();

  router.post("/", tokenVerification, bodyweightController.createEntry);
  router.get("/", tokenVerification, bodyweightController.listEntries);

  app.use("/users/bodyweight", router);
};

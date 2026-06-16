/**
 * User routes mounted under `/users`.
 *
 * Endpoints:
 * - POST `/users/signin`
 * - POST `/users/renew` (refresh token in body)
 * - POST `/users/signup`
 * - GET  `/users/profile` (Bearer token)
 *
 * Detailed API docs: `docs/API.md`
 */
module.exports = (app) => {
  const clientController = require("../controllers/user_controller");
  const {
    tokenVerification,
    roleMiddleware,
    refreshTokenVerification,
  } = require("../middlewares/authentificationHelper");
  const rateLimit = require("express-rate-limit");
  var router = require("express").Router();

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later." },
  });

  // signin signup
  // POST /users/signin
  router.post("/signin", authLimiter, clientController.signIn);
  // POST /users/renew
  router.post("/renew", refreshTokenVerification, clientController.renewJWT);

  // POST /users/signup
  router.post("/signup", authLimiter, clientController.signUp);
  // GET /users/profile
  router.get("/profile", tokenVerification, clientController.profile);

  app.use("/users", router);
};

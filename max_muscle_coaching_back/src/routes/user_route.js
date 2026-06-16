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
  const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
  var router = require("express").Router();

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again later." },
  });

  // Token refresh is privileged — keep it tight to slow down stolen-refresh-
  // token replay. Keyed on the refresh-token subject so one compromised
  // device doesn't lock out other devices behind the same NAT.
  const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) =>
      req.decoded?.id
        ? `renew:user:${req.decoded.id}`
        : `renew:ip:${ipKeyGenerator(req.ip)}`,
    message: { message: "Too many refresh attempts, please sign in again." },
  });

  // signin signup
  // POST /users/signin
  router.post("/signin", authLimiter, clientController.signIn);
  // POST /users/renew
  router.post(
    "/renew",
    refreshTokenVerification,
    refreshLimiter,
    clientController.renewJWT,
  );

  // POST /users/signup
  router.post("/signup", authLimiter, clientController.signUp);
  // GET /users/profile
  router.get("/profile", tokenVerification, clientController.profile);

  app.use("/users", router);
};

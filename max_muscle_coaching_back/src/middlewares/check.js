/**
 * Lightweight JWT guard used by some legacy routes.
 *
 * Behavior:
 * - Can be disabled via `CHECK_DISABLED=true`
 * - Reads token from `Authorization` header (Bearer supported)
 * - Sets `req.decoded` on success
 */
const jwt = require("jsonwebtoken");

/**
 * Express middleware: verifies JWT and blocks requests when missing/invalid.
 */
function check(req, res, next) {
  if (process.env.CHECK_DISABLED === "true") {
    return next();
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  const authorization = req.headers.authorization || req.headers.Authorization;
  if (!authorization) {
    return res.status(403).json({ message: "no_token_provided" });
  }

  const bearerPrefix = "Bearer ";
  const token = authorization.startsWith(bearerPrefix)
    ? authorization.slice(bearerPrefix.length)
    : authorization;

  try {
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(403).json({ message: "invalid_token" });
  }
}

module.exports = { check };

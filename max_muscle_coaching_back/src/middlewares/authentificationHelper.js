/**
 * Authentication / authorization middleware helpers.
 *
 * Conventions:
 * - Access token: `Authorization: Bearer <jwt>`
 * - Refresh token: `{ refreshToken: "<jwt>" }` in request body
 *
 * These middlewares populate `req.decoded` when authentication succeeds.
 */
const jwt = require("jsonwebtoken");
const Bcrypt = require("bcrypt");
const User = require("../models/user_model");

/**
 * Validates a JWT from the `Authorization` header and sets `req.decoded`.
 */
function tokenVerification(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ message: "no_token_provided" });
  }

  const bearerPrefix = "Bearer ";
  if (token.startsWith(bearerPrefix)) {
    token = token.slice(bearerPrefix.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "session_expired" });
    }
    req.decoded = decoded;
    next();
  });
}

/**
 * Validates a refresh token from `req.body.refreshToken` and sets `req.decoded`.
 */
function refreshTokenVerification(req, res, next) {
  const token = req.body?.refreshToken;
  if (!token) {
    return res.status(403).json({ message: "no_token_provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(406).json({ success: false, message: "session_expired" });
    }
    req.decoded = decoded;
    next();
  });
}

/**
 * Best-effort decode of a JWT from the `Authorization` header.
 *
 * Unlike `tokenVerification`, it does not fail the request if the token is missing/invalid.
 */
function tokenGetId(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) return next();

  const bearerPrefix = "Bearer ";
  if (token.startsWith(bearerPrefix)) {
    token = token.slice(bearerPrefix.length);
  }

  try {
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // ignore
  }
  next();
}

/**
 * Authorization middleware to allow only specific roles (expects `req.decoded.role`).
 */
function roleMiddleware(roles) {
  return (req, res, next) => {
    const right = req.decoded?.role;
    if (right && roles.some((role) => String(right).includes(role))) return next();
    return res.status(403).send("access_denied");
  };
}

/**
 * Role-based auth using basic credentials passed via headers (`email`, `password`).
 *
 * This is separate from JWT-based auth and is mainly useful for admin tooling.
 */
function roleAuth(roles) {
  return async (req, res, next) => {
    const email = req.headers["email"];
    const password = req.headers["password"];

    if (!email || !password) {
      return res.status(403).json({ message: "missing_credentials" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "client_not_found" });
    }

    const isPasswordValid = user.password
      ? await Bcrypt.compare(password, user.password)
      : false;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid_credentials" });
    }

    if (user.role && roles.some((role) => String(user.role).includes(role))) {
      req.decoded = { id: user.id, role: user.role };
      return next();
    }
    return res.status(403).json({ message: "access_denied" });
  };
}

/**
 * Ensures the authenticated user is verified (`User.isVerified === true`).
 */
async function clientIsVerified(req, res, next) {
  const userFound = await User.findByPk(req.decoded?.id);
  if (userFound?.isVerified) return next();
  return res.status(400).json({ message: "must_verify_account" });
}

/**
 * Placeholder for mail-token logic (not implemented).
 */
function tokenMail(req, res) {
  return res.status(501).json({ message: "tokenMail_not_implemented" });
}

module.exports = {
  tokenVerification,
  refreshTokenVerification,
  tokenGetId,
  tokenMail,
  roleMiddleware,
  roleAuth,
  clientIsVerified,
};

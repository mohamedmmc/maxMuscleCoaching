/**
 * Express app setup.
 *
 * This module configures middleware (body parsing, CORS) and a basic route for
 * serving exercise images from `public/exercises`.
 *
 * Routes are mounted in `index.js`.
 */

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var cors = require("cors");
const path = require("path");

// config
dotenv.config();

// const

const app = express();

// Middleware
app.use(bodyParser.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5050,http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: "application/xml" }));

// Exercise images: strict allow-list + res.sendFile root to neutralize traversal.
const EXERCISES_ROOT = path.join(__dirname, "public", "exercises");
const SAFE_FOLDER = /^[A-Za-z0-9_-]{1,128}$/;
const SAFE_IMAGE = /^[A-Za-z0-9_-]{1,128}\.(jpe?g|png|gif|webp)$/i;

app.get("/public/exercises/:id/images/:imageId", (req, res) => {
  const { id, imageId } = req.params;
  if (!SAFE_FOLDER.test(id) || !SAFE_IMAGE.test(imageId)) {
    return res.status(400).end();
  }
  res.set("Cache-Control", "public, max-age=86400");
  res.sendFile(
    `${id}/images/${imageId}`,
    { root: EXERCISES_ROOT, dotfiles: "deny" },
    (err) => {
      if (err && !res.headersSent) res.status(404).end();
    }
  );
});

module.exports = app;

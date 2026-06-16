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
app.get("/public/exercises/:id/images/:imageId", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      `./public/exercises/${req.params.id}/images/${req.params.imageId}`
    )
  );
});
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

module.exports = app;

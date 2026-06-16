/**
 * App-wide structured logger (pino).
 *
 * Usage:
 *   const logger = require("../helper/logger");
 *   logger.info({ userId }, "user signed in");
 *   logger.error({ err }, "operation failed");
 *
 * In development, output is pretty-printed via pino-pretty.
 * In production, output is line-delimited JSON for log aggregation.
 */
const pino = require("pino");

const isProd = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss.l",
            ignore: "pid,hostname",
          },
        },
      }),
});

module.exports = logger;

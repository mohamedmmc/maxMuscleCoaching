/**
 * Sequelize DB connection configuration.
 *
 * Environment variables used:
 * - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DB`, `DB_DIALECT`, `DB_SYNC_FORCE`, `DB_SYNC_ALTER`
 *
 * The exported `sequelize` instance is used throughout models and services.
 */
const Sequelize = require("sequelize");

require("dotenv").config();
var dbConfig = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DB,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  port: 3306,
};

//Initialize connection to DB
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: false,
  port: dbConfig.port,
});

async function deleteDatabase() {
  // backup();
  await sequelize.sync({ force: true });
}

module.exports = {
  Sequelize,
  sequelize,
  deleteDatabase,
  // backup,
};

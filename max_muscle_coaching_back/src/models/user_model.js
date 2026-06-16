/**
 * Sequelize model: User
 *
 * Stores authentication identifiers (email/social ids) + workout preferences used for recommendation.
 *
 * Associations:
 * - User -> WorkoutHistory (one-to-many)
 */
const { sequelize, Sequelize } = require("../config/db.config"); // Adjust the path as needed

const SENSITIVE_USER_FIELDS = ["password", "googleId", "facebookId", "appleId"];

const User = sequelize.define("User", {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  googleId: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  facebookId: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  appleId: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  height: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },

  gender: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Male",
  },
  fitnessLevel: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Beginner",
  },
  injuryHistory: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: "",
  },
  split: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Push/Pull/Legs",
  },
  daysPerWeek: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 4,
  },
  sessionDurationMinutes: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 45,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Gym",
  },
  currentStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  longestStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lastWorkoutDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
}, {
  defaultScope: {
    attributes: { exclude: SENSITIVE_USER_FIELDS },
  },
  scopes: {
    // Use only for auth flows that must compare/read sensitive fields.
    withSecrets: {},
  },
});

// Defense in depth: never serialize sensitive fields, regardless of how the
// instance was fetched.
User.prototype.toJSON = function () {
  const v = { ...this.get() };
  for (const f of SENSITIVE_USER_FIELDS) delete v[f];
  return v;
};

// Define associations
User.associate = () => {
  const WorkoutHistory = require("./workout_history_model");

  User.hasMany(WorkoutHistory, {
    foreignKey: "userId",
  });
};

module.exports = User;

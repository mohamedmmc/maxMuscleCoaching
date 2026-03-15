/**
 * Sequelize model: Muscle
 *
 * Represents a muscle group used by exercises (ex: "quadriceps").
 *
 * Associations:
 * - Muscle <-> Exercise (many-to-many) via `ExerciseMuscle`
 */
const { sequelize, Sequelize } = require("../config/db.config");

const Muscle = sequelize.define("Muscle", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

Muscle.associate = () => {
  const Exercise = require("./exercise_model");
  const ExerciseMuscle = require("./exercise_muscle_model");

  Muscle.belongsToMany(Exercise, {
    through: ExerciseMuscle,
    foreignKey: "muscleId",
    otherKey: "exerciseId",
  });
};

module.exports = Muscle;


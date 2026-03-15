/**
 * Sequelize model: ExerciseMuscle
 *
 * Join table between `Exercise` and `Muscle` with role metadata:
 * - role: "primary" | "secondary"
 */
const { sequelize, Sequelize } = require("../config/db.config");

const ExerciseMuscle = sequelize.define(
  "ExerciseMuscle",
  {
    exerciseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Exercises",
        key: "id",
      },
    },
    muscleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Muscles",
        key: "id",
      },
    },
    role: {
      type: Sequelize.ENUM("primary", "secondary"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ["exerciseId"] }, { fields: ["muscleId"] }],
  }
);

ExerciseMuscle.associate = () => {
  const Exercise = require("./exercise_model");
  const Muscle = require("./muscle_model");

  ExerciseMuscle.belongsTo(Exercise, { foreignKey: "exerciseId" });
  ExerciseMuscle.belongsTo(Muscle, { foreignKey: "muscleId" });
};

module.exports = ExerciseMuscle;


/**
 * Sequelize model: Exercise
 *
 * Represents an exercise definition (name/force/level/mechanic/equipment/category).
 *
 * Associations:
 * - Exercise <-> WorkoutTemplate (many-to-many) via `WorkoutTemplateExercise`
 * - Exercise -> Gallery (one-to-many)
 * - Exercise <-> Muscle (many-to-many) via `ExerciseMuscle` with `role` (primary/secondary)
 */
const { sequelize, Sequelize } = require("../config/db.config");

const Exercise = sequelize.define("Exercise", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  force: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  level: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  mechanic: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  equipment: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// Define associations
Exercise.associate = () => {
  const WorkoutTemplate = require("./workout_template_model");
  const WorkoutTemplateExercise = require("./workout_template_exercise_model");
  const Gallery = require("./gallery_model");
  const Muscle = require("./muscle_model");
  const ExerciseMuscle = require("./exercise_muscle_model");

  Exercise.belongsToMany(WorkoutTemplate, {
    through: WorkoutTemplateExercise,
    foreignKey: "exerciseId",
  });

  Exercise.hasMany(Gallery, { foreignKey: "exerciseId" });

  Exercise.belongsToMany(Muscle, {
    as: "primaryMuscles",
    through: { model: ExerciseMuscle, scope: { role: "primary" } },
    foreignKey: "exerciseId",
    otherKey: "muscleId",
  });

  Exercise.belongsToMany(Muscle, {
    as: "secondaryMuscles",
    through: { model: ExerciseMuscle, scope: { role: "secondary" } },
    foreignKey: "exerciseId",
    otherKey: "muscleId",
  });
};

module.exports = Exercise;

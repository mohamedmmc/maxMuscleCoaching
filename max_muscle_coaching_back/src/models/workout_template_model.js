/**
 * Sequelize model: WorkoutTemplate
 *
 * A reusable workout plan that can be assigned as a daily session.
 *
 * Associations:
 * - WorkoutTemplate <-> Exercise (many-to-many) via WorkoutTemplateExercise
 * - WorkoutTemplate -> WorkoutHistory (one-to-many)
 */
const { sequelize, Sequelize } = require("../config/db.config");

const WorkoutTemplate = sequelize.define("WorkoutTemplate", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dayOfWeek: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'Any',
  },
  focus: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  split: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fitnessLevel: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isRestDay: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  estimatedDurationMinutes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 45,
  },
});

// Define associations
WorkoutTemplate.associate = () => {
  const Exercise = require('./exercise_model');
  const WorkoutTemplateExercise = require('./workout_template_exercise_model');
  const WorkoutHistory = require('./workout_history_model');

  WorkoutTemplate.belongsToMany(Exercise, {
    through: WorkoutTemplateExercise,
    foreignKey: 'workoutTemplateId'
  });

  WorkoutTemplate.hasMany(WorkoutHistory, {
    foreignKey: 'workoutTemplateId'
  });
};

module.exports = WorkoutTemplate;

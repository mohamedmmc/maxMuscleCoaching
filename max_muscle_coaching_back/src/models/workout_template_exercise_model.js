/**
 * Sequelize model: WorkoutTemplateExercise
 *
 * Join table between `WorkoutTemplate` and `Exercise` with plan metadata:
 * orderIndex, sets, reps, restSeconds, notes.
 */
const { sequelize, Sequelize } = require("../config/db.config");

const WorkoutTemplateExercise = sequelize.define("WorkoutTemplateExercise", {
  workoutTemplateId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'WorkoutTemplates',
      key: 'id'
    }
  },
  exerciseId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Exercises',
      key: 'id'
    }
  },
  orderIndex: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  sets: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 3,
  },
  reps: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '8-12',
  },
  restSeconds: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

// Define associations
WorkoutTemplateExercise.associate = () => {
  const WorkoutTemplate = require('./workout_template_model');
  const Exercise = require('./exercise_model');

  WorkoutTemplateExercise.belongsTo(WorkoutTemplate, {
    foreignKey: 'workoutTemplateId'
  });

  WorkoutTemplateExercise.belongsTo(Exercise, {
    foreignKey: 'exerciseId'
  });
};

module.exports = WorkoutTemplateExercise;

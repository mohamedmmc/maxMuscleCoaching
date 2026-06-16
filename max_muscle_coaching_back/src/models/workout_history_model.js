/**
 * Sequelize model: WorkoutHistory
 *
 * One workout session per user per day (`dateAssigned`).
 *
 * Associations:
 * - WorkoutHistory belongsTo User
 * - WorkoutHistory belongsTo WorkoutTemplate
 * - WorkoutHistory hasMany WorkoutHistoryExercise
 */
const { sequelize, Sequelize } = require("../config/db.config");

const WorkoutHistory = sequelize.define("WorkoutHistory", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  workoutTemplateId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'WorkoutTemplates',
      key: 'id'
    }
  },
  dateAssigned: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ["userId", "dateAssigned"],
      name: "workout_history_user_date_unique",
    },
  ],
});

// Define associations
WorkoutHistory.associate = () => {
  const User = require('./user_model');
  const WorkoutTemplate = require('./workout_template_model');
  const WorkoutHistoryExercise = require("./workout_history_exercise_model");

  WorkoutHistory.belongsTo(User, {
    foreignKey: 'userId'
  });

  WorkoutHistory.belongsTo(WorkoutTemplate, {
    foreignKey: 'workoutTemplateId'
  });

  WorkoutHistory.hasMany(WorkoutHistoryExercise, {
    foreignKey: "workoutHistoryId",
  });
};

module.exports = WorkoutHistory;

/**
 * Sequelize model: WorkoutHistoryExercise
 *
 * Stores per-exercise progress for a given `WorkoutHistory`:
 * planned sets/reps/rest/notes + performed sets + completion flag.
 *
 * Uniqueness:
 * - One row per (workoutHistoryId, exerciseId)
 *
 * Associations:
 * - WorkoutHistoryExercise belongsTo WorkoutHistory
 * - WorkoutHistoryExercise belongsTo Exercise
 */
const { sequelize, Sequelize } = require("../config/db.config");

const WorkoutHistoryExercise = sequelize.define(
  "WorkoutHistoryExercise",
  {
    workoutHistoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "WorkoutHistories",
        key: "id",
      },
    },
    exerciseId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Exercises",
        key: "id",
      },
    },
    orderIndex: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    plannedSets: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    plannedReps: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    plannedRestSeconds: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    plannedNotes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    performedSets: {
      // Array of { setNumber, reps, weight?, notes? }
      type: Sequelize.JSON,
      allowNull: true,
    },
    completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["workoutHistoryId", "exerciseId"],
      },
    ],
  }
);

WorkoutHistoryExercise.associate = () => {
  const WorkoutHistory = require("./workout_history_model");
  const Exercise = require("./exercise_model");

  WorkoutHistoryExercise.belongsTo(WorkoutHistory, {
    foreignKey: "workoutHistoryId",
  });

  WorkoutHistoryExercise.belongsTo(Exercise, {
    foreignKey: "exerciseId",
  });
};

module.exports = WorkoutHistoryExercise;

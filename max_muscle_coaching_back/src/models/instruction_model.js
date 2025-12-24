/**
 * Sequelize model: Instruction
 *
 * Text instructions linked to an exercise.
 *
 * Associations:
 * - Instruction belongsTo Exercise
 * - Exercise hasMany Instruction
 */
const { sequelize, Sequelize } = require("../config/db.config"); // Adjust the path as needed
const Exercise = require("./exercise_model");

const Instruction = sequelize.define("Instruction", {
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Exercise.hasMany(Instruction);
Instruction.belongsTo(Exercise);

module.exports = Instruction;

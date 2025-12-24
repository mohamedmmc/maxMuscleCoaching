/**
 * Sequelize model: Gallery
 *
 * Media linked to an exercise (images/videos).
 *
 * Associations:
 * - Gallery belongsTo Exercise
 * - Exercise hasMany Gallery
 */
const { sequelize, Sequelize } = require("../config/db.config");
const Exercise = require("./exercise_model");

const Gallery = sequelize.define("Gallery", {
  exerciseId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "Exercises",
      key: "id",
    },
  },
  link: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM("image", "video"),
    allowNull: false,
  },
});

Exercise.hasMany(Gallery, { foreignKey: "exerciseId" });
Gallery.belongsTo(Exercise, { foreignKey: "exerciseId" });

module.exports = Gallery;

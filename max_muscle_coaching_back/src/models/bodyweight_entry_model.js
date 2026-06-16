/**
 * Sequelize model: BodyweightEntry
 *
 * One row per bodyweight log. Multiple entries per user/day are allowed —
 * frontend can dedupe to "latest of the day" if needed.
 *
 * Associations:
 * - BodyweightEntry belongsTo User
 */
const { sequelize, Sequelize } = require("../config/db.config");

const BodyweightEntry = sequelize.define(
  "BodyweightEntry",
  {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    weight: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    dateLogged: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        fields: ["userId", "dateLogged"],
      },
    ],
  },
);

BodyweightEntry.associate = () => {
  const User = require("./user_model");
  BodyweightEntry.belongsTo(User, { foreignKey: "userId" });
};

module.exports = BodyweightEntry;

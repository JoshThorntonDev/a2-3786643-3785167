//Model for follow table in database
//Adapted from week 8 lab user.js

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "follow",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );

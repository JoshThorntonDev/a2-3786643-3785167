//Model for post table in database
//Adapted from week 8 lab user.js

module.exports = (sequelize, DataTypes) =>
    sequelize.define("post", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(),
            defaultValue: "",
            allowNull: false
        }

    });
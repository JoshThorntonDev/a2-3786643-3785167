//Model for user table in database
//Adapted from week 8 lab user.js

module.exports = (sequelize, DataTypes) =>
    sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(254),
            allowNull: false
        },
        password_hash: {
            type: DataTypes.STRING(96),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(40),
            allowNull: false
        }   
    }, {
        initialAutoIncrement: 100,
    });
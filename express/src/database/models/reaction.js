module.exports = (sequelize, DataTypes) =>
    sequelize.define("reaction", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING, // string instead of bool because it would make it easier to add more reaction types later
            allowNull: false
        },

    }, {
        timestamps: false
    });
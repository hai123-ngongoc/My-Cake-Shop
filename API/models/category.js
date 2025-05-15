const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
        },
        created_by: {
            type: DataTypes.INTEGER,
        },
        updated_at: {
            type: DataTypes.DATE,
        },
        updated_by: {
            type: DataTypes.INTEGER,
        },
        deleted_at: {
            type: DataTypes.DATE,
        },
        deleted_by: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'category',
        timestamps: false,
    });
    return Category;
};
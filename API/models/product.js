const {Sequelize, DataTypes} = require('sequelize');
const db = require('./index');

const Product = db.define('Product', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        importPrice: {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: true,
        },

        salesPrice: {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        barcode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },

    {
        tableName: 'products',
        timestamps: true,
        underscored: true,
    },
);

module.exports = Product; // xuất product ra khỏi file hiện tại để sưr dụng cho file js khác bằng require
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as per your project structure

const Part = sequelize.define('Part', {
    part_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Foreign key referencing the products table
    },
    part_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'Parts',
    timestamps: false,
});

module.exports = Part;

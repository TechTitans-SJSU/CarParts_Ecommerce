const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as per your project structure

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  part_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the car_parts_inventory table
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,  // Optional field
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,  // Optional field
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the categories table
  },
}, {
  tableName: 'Products',  // Make sure it matches the actual table name in PostgreSQL
  timestamps: false,  // Disable automatic Sequelize timestamps
});

module.exports = Product;

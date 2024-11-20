const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as per your project structure

const Product = sequelize.define('Product', {

  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the categories table
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

}, {
  tableName: 'Products',  // Make sure it matches the actual table name in PostgreSQL
  timestamps: false,  // Disable automatic Sequelize timestamps
});

module.exports = Product;

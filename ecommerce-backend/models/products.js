const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  tableName: 'Products',
  timestamps: false,
});

module.exports = Product;

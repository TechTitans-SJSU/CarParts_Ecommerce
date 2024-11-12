const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as per your project structure

const Shipping = sequelize.define('Shipping', {
  shipping_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the Orders table
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,  // Shipping address
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true,  // Tracking number (optional)
  },
  shipping_date: {
    type: DataTypes.DATE,
    allowNull: false,  // Date the order was shipped
    defaultValue: DataTypes.NOW,  // Default to current timestamp
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: true,  // Estimated delivery date (optional)
  },
}, {
  tableName: 'Shipping',  // Ensure it matches the actual table name in PostgreSQL
  timestamps: false,  // Disable automatic Sequelize timestamps
});

module.exports = Shipping;

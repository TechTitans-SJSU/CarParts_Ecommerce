const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as per your project structure

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the Users table
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,  // Date and time of the order
    defaultValue: DataTypes.NOW,  // Set default to current timestamp
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,  // Status of the order (pending, shipped, etc.)
  },
  shipping_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the Shipping table
  },
}, {
  tableName: 'Orders',  // Matches the table name in PostgreSQL
  timestamps: false,  // Disable automatic Sequelize timestamps
});

module.exports = Order;

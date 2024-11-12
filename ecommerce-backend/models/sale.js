const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust the path according to your project structure

const Sale = sequelize.define('Sale', {
  sale_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the Users table
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,  // Total amount for the sale
  },
  sale_date: {
    type: DataTypes.DATE,
    allowNull: false,  // Date and time of the sale
    defaultValue: DataTypes.NOW,  // Set default value to the current timestamp
  },
}, {
  tableName: 'Sales',  // Ensure it matches the actual table name in PostgreSQL
  timestamps: false,  // Disable automatic Sequelize timestamps
});

module.exports = Sale;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the Orders table
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,  // Amount paid
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'Payments',
  timestamps: false,
});

module.exports = Payment;

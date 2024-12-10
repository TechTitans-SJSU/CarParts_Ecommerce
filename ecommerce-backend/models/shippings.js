const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    allowNull: false,
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  shipping_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Shipping',
  timestamps: false,
});

module.exports = Shipping;

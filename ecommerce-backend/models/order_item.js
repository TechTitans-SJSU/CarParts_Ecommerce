const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust path as per your project structure

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the Orders table
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Foreign key referencing the Products table
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,  // Quantity of the product ordered
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,  // Price of the product at the time of order
  },
}, {
  tableName: 'OrderItems',  // Matches the table name in PostgreSQL
  timestamps: false,  // Disable automatic Sequelize timestamps
});

module.exports = OrderItem;

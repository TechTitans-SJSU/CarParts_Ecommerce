const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//const UserOrder = require('./UserOrder');

const UserOrder = sequelize.define('userorders', {
 order_id: {
   type: DataTypes.STRING,
   primaryKey: true
 },
 user_id: {
   type: DataTypes.STRING,
   allowNull: false
 },
 total_amount: {
   type: DataTypes.DECIMAL(10,2),
   allowNull: false
 },
 shipping_address: {
   type: DataTypes.TEXT,
   allowNull: false
 },
 city: {
   type: DataTypes.STRING(100),
   allowNull: false
 },
 zip_code: {
   type: DataTypes.STRING(20),
   allowNull: false
 },
 status: {
   type: DataTypes.STRING(20),
   allowNull: false,
   defaultValue: 'PENDING'
 },
 first_name: {
   type: DataTypes.STRING(100),
   allowNull: false
 },
 last_name: {
   type: DataTypes.STRING(100), 
   allowNull: false
 },
 email: {
   type: DataTypes.STRING(255),
   allowNull: false
 },
 payment_details: {
   type: DataTypes.JSONB,
   allowNull: false
 },
 created_at: {
   type: DataTypes.DATE,
   defaultValue: DataTypes.NOW
 }
}, {
 tableName: 'userorders',
 timestamps: false
});

UserOrder.associate = (models) => {
 UserOrder.hasMany(models.UserOrderItem, {
   foreignKey: 'order_id',
   as: 'items'
 });
};

module.exports = UserOrder;
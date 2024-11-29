const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//const UserOrder = require('./userorder');

const UserOrderItem = sequelize.define('userorderitems', {
 id: {
   type: DataTypes.INTEGER,
   primaryKey: true,
   autoIncrement: true
 },
 order_id: {
   type: DataTypes.STRING,
   allowNull: false,
   references: {
     model: 'userorders',
     key: 'order_id'
   }
 },
 part_id: {
   type: DataTypes.INTEGER,
   allowNull: false
 },
 quantity: {
   type: DataTypes.INTEGER,
   allowNull: false
 },
 price: {
   type: DataTypes.DECIMAL(10,2),
   allowNull: false
 }
}, {
 tableName: 'userorderitems',
 timestamps: false
});

UserOrderItem.associate = (models) => {
    UserOrderItem.belongsTo(models.UserOrder, {
   foreignKey: 'order_id',
   as: 'order'
 });
};

module.exports = UserOrderItem;
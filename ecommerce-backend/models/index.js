const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./users');
db.Product = require('./products');
db.Category = require('./category');
db.Order = require('./orders');
db.Payment = require('./payments');
db.Shipping = require('./shippings');
db.Sale = require('./sale');
db.Part = require('./parts');
db.userorders = require('./userorder');
db.userorderitems = require('./userorderitem');

// Relationships
db.Category.hasMany(db.Product, { foreignKey: 'category_id' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

db.User.hasMany(db.Order, { foreignKey: 'user_id' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

db.Product.hasMany(db.Part, { foreignKey: 'product_id' });
db.Part.belongsTo(db.Product, { foreignKey: 'product_id' });

db.userorders.hasMany(db.userorderitems, { foreignKey: 'order_id' });
db.userorderitems.belongsTo(db.userorders, { foreignKey: 'order_id' });

module.exports = db;

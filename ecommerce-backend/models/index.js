// const Sequelize = require('sequelize');
// const sequelize = require('../config/database');

// const User = require('./users');  // If models are directly exported
// const Product = require('./products');
// const Category = require('./category');
// const Order = require('./orders');
// const OrderItem = require('./order_item');
// const Payment = require('./payments');
// const Shipping = require('./shippings');
// const Sale = require('./sale');

// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.User = User(sequelize, Sequelize);
// db.Product = Product(sequelize, Sequelize);
// db.Category = Category(sequelize, Sequelize);
// db.Order = Order(sequelize, Sequelize);
// db.OrderItem = OrderItem(sequelize, Sequelize);
// db.Payment = Payment(sequelize, Sequelize);
// db.Shipping = Shipping(sequelize, Sequelize);
// db.Sale = Sale(sequelize, Sequelize);

// // db.User = User;
// // db.Product = Product;
// // db.Category = Category;
// // db.Order = Order;
// // db.OrderItem = OrderItem;
// // db.Payment = Payment;
// // db.Shipping = Shipping;
// // db.Sale = Sale;

// // // Relationships
// // db.Category.hasMany(db.Product);
// // db.Product.belongsTo(db.Category);

// // db.User.hasMany(db.Order);
// // db.Order.belongsTo(db.User);

// // db.Order.hasMany(db.OrderItem);
// // db.OrderItem.belongsTo(db.Order);

// // db.Order.hasOne(db.Shipping);
// // db.Shipping.belongsTo(db.Order);

// // db.Order.hasOne(db.Payment);
// // db.Payment.belongsTo(db.Order);

// // db.Order.hasOne(db.Sale);
// // db.Sale.belongsTo(db.Order);

// // db.Product.hasMany(db.OrderItem);
// // db.OrderItem.belongsTo(db.Product);
// // Category and Product
// db.Category.hasMany(db.Product, { foreignKey: 'category_id' });  // A category can have many products
// db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });  // Each product belongs to one category

// // User and Order
// db.User.hasMany(db.Order, { foreignKey: 'user_id' });  // A user can have many orders
// db.Order.belongsTo(db.User, { foreignKey: 'user_id' });  // Each order belongs to one user

// // Order and OrderItem
// db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id' });  // An order can have many order items
// db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });  // Each order item belongs to one order

// // Order and Shipping
// db.Order.hasOne(db.Shipping, { foreignKey: 'order_id' });  // Each order has one shipping record
// db.Shipping.belongsTo(db.Order, { foreignKey: 'order_id' });  // Each shipping record belongs to one order

// // Order and Payment
// db.Order.hasOne(db.Payment, { foreignKey: 'order_id' });  // Each order has one payment record
// db.Payment.belongsTo(db.Order, { foreignKey: 'order_id' });  // Each payment record belongs to one order

// // Order and Sale
// db.Order.hasOne(db.Sale, { foreignKey: 'order_id' });  // Each order has one sale record
// db.Sale.belongsTo(db.Order, { foreignKey: 'order_id' });  // Each sale record belongs to one order

// // Product and OrderItem
// db.Product.hasMany(db.OrderItem, { foreignKey: 'product_id' });  // A product can be in many order items
// db.OrderItem.belongsTo(db.Product, { foreignKey: 'product_id' });  // Each order item is for one product

// // Sync the models
// db.sequelize.sync({ alter: true });  // Safely sync models without dropping tables

// module.exports = db;
const Sequelize = require('sequelize');
const sequelize = require('../config/database');  // Adjust path to your database config

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./users');
db.Product = require('./products');
db.Category = require('./category');
db.Order = require('./orders');
db.OrderItem = require('./order_item');
db.Payment = require('./payments');
db.Shipping = require('./shippings');
db.Sale = require('./sale');
db.Part = require('./parts');

// Relationships
db.Category.hasMany(db.Product, { foreignKey: 'category_id' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

db.User.hasMany(db.Order, { foreignKey: 'user_id' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Order.hasMany(db.Shipping, { foreignKey: 'order_id' });
db.Shipping.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Order.hasOne(db.Payment, { foreignKey: 'order_id' });
db.Payment.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Order.hasMany(db.Sale, { foreignKey: 'order_id' });
db.Sale.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Product.hasMany(db.OrderItem, { foreignKey: 'product_id' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'product_id' });
db.Product.hasMany(db.Part, { foreignKey: 'product_id' });
db.Part.belongsTo(db.Product, { foreignKey: 'product_id' });




// // Sync the models
// db.sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Database synchronized');
//   })
//   .catch((error) => {
//     console.error('Error syncing the database:', error);
//   });

module.exports = db;

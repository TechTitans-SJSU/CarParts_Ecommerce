const { Sequelize } = require('sequelize');

// Initialize PostgreSQL connection
const sequelize = new Sequelize('car_parts_db', 'ecommerce_user', 'ecommerce_pass', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;

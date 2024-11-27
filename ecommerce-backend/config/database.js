// const { Sequelize } = require('sequelize');

// // Initialize PostgreSQL connection
// const sequelize = new Sequelize('car_parts_db', 'ecommerce_user', 'ecommerce_pass', {
//   host: 'localhost',
//   dialect: 'postgres',
//   logging: console.log,
// });

// module.exports = sequelize;

const Sequelize = require('sequelize');

// Initialize connection with neon database
const sequelize = new Sequelize('car_parts_db', 'car_parts_db_owner', '0F4QXKRPmHBW', {
  host: 'ep-bold-union-a698c6lj.us-west-2.aws.neon.tech',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
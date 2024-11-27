const Sequelize = require('sequelize');
require('dotenv').config();

// Initialize connection with neon database
// const sequelize = new Sequelize('car_parts_db', 'car_parts_db_owner', '0F4QXKRPmHBW', {
//   host: 'ep-bold-union-a698c6lj.us-west-2.aws.neon.tech',
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   }
// });

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = sequelize;
const Sequelize = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       }
//     }
//   }
// );

// module.exports = sequelize;


class Database {
    // Static property to hold the single instance
    static instance;

    constructor() {
        if (!Database.instance) {
            // Initialize Sequelize connection
            this.sequelize = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USER,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    dialect: process.env.DB_DIALECT || 'postgres',
                    dialectOptions: {
                        ssl: {
                            require: true,
                            rejectUnauthorized: false,
                        },
                    },
                }
            );

            // Cache the instance
            Database.instance = this;
        }

        // Return the single instance
        return Database.instance;
    }

    // Method to get the Sequelize instance
    getSequelizeInstance() {
        return this.sequelize;
    }
}

// Exporting a single instance of the database connection
const databaseInstance = new Database();
module.exports = databaseInstance.getSequelizeInstance();


// class Database {
//     static instance;

//     constructor() {
//         if (!Database.instance) {
//             const config = {
//                 // Use test configuration if in test environment
//                 ...(process.env.NODE_ENV === 'test' ? {
//                     database: 'test_db',
//                     username: 'test_user',
//                     password: 'test_password',
//                     host: 'localhost',
//                     dialect: 'postgres',
//                     logging: false
//                 } : {
//                     // Production/development configuration
//                     database: process.env.DB_NAME,
//                     username: process.env.DB_USER,
//                     password: process.env.DB_PASSWORD,
//                     host: process.env.DB_HOST,
//                     dialect: 'postgres',
//                     dialectOptions: {
//                         ssl: {
//                             require: true,
//                             rejectUnauthorized: false,
//                         },
//                     },
//                     logging: false
//                 })
//             };

//             this.sequelize = new Sequelize(config);
//             Database.instance = this;
//         }

//         return Database.instance;
//     }

//     getSequelizeInstance() {
//         return this.sequelize;
//     }

//     async testConnection() {
//         try {
//             await this.sequelize.authenticate();
//             console.log('Database connection has been established successfully.');
//             return true;
//         } catch (error) {
//             console.error('Unable to connect to the database:', error);
//             return false;
//         }
//     }
// }

// const databaseInstance = new Database();
// module.exports = databaseInstance.getSequelizeInstance();
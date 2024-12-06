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


// class Database {
//     // Static property to hold the single instance
//     static instance;

//     constructor() {
//         if (!Database.instance) {
//             // Initialize Sequelize connection
//             this.sequelize = new Sequelize(
//                 process.env.DB_NAME,
//                 process.env.DB_USER,
//                 process.env.DB_PASSWORD,
//                 {
//                     host: process.env.DB_HOST,
//                     dialect: process.env.DB_DIALECT || 'postgres',
//                     dialectOptions: {
//                         ssl: {
//                             require: true,
//                             rejectUnauthorized: false,
//                         },
//                     },
//                 }
//             );

//             // Cache the instance
//             Database.instance = this;
//         }

//         // Return the single instance
//         return Database.instance;
//     }

//     // Method to get the Sequelize instance
//     getSequelizeInstance() {
//         return this.sequelize;
//     }
// }

// // Exporting a single instance of the database connection
// const databaseInstance = new Database();
// module.exports = databaseInstance.getSequelizeInstance();


// const Sequelize = require('sequelize');
// require('dotenv').config();

class Database {
    static instance;

    constructor() {
        if (!Database.instance) {
            // Default to postgres if not specified
            const dialect = process.env.DB_DIALECT || 'postgres';

            // Initialize Sequelize connection
            this.sequelize = new Sequelize({
                database: process.env.DB_NAME || 'test_db',
                username: process.env.DB_USER || 'test_user',
                password: process.env.DB_PASSWORD || 'test_password',
                host: process.env.DB_HOST || 'localhost',
                dialect,
                ...(process.env.NODE_ENV === 'test' ? {
                    logging: false,
                } : {
                    dialectOptions: {
                        ssl: {
                            require: true,
                            rejectUnauthorized: false,
                        },
                    },
                })
            });

            Database.instance = this;
        }

        return Database.instance;
    }

    getSequelizeInstance() {
        return this.sequelize;
    }
}

const databaseInstance = new Database();
module.exports = databaseInstance.getSequelizeInstance();
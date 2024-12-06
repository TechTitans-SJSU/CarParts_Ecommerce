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


const Sequelize = require('sequelize');
require('dotenv').config();

class Database {
    static instance;

    constructor() {
        if (!Database.instance) {
            // Ensure DB_DIALECT is available before creating connection
            if (!process.env.DB_DIALECT) {
                throw new Error('DB_DIALECT environment variable is required');
            }

            // Initialize Sequelize connection with explicit dialect
            this.sequelize = new Sequelize({
                database: process.env.DB_NAME,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST,
                dialect: process.env.DB_DIALECT,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                },
                logging: console.log // Add this for debugging connection issues
            });

            Database.instance = this;
        }

        return Database.instance;
    }

    getSequelizeInstance() {
        return this.sequelize;
    }

    async testConnection() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    }
}

const databaseInstance = new Database();
module.exports = databaseInstance.getSequelizeInstance();
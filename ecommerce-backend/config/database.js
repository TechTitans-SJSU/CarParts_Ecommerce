const Sequelize = require('sequelize');
require('dotenv').config();

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

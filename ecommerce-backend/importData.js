// const fs = require('fs');
// const csv = require('csv-parser');
// const db = require('./models');
// const { Op } = require('sequelize');

// // Function to log errors to a file
// const logError = (message) => {
//   const timestamp = new Date().toISOString();
//   fs.appendFile('error.log', `[${timestamp}] ${message}\n`, (err) => {
//     if (err) console.error("Failed to write to log file:", err);
//   });
// };

// // Function to check existing records
// const checkExistingRecords = async (model, uniqueKey, data) => {
//   const uniqueValues = [...new Set(data.map(item => item[uniqueKey]))];
//   const existingRecords = await model.findAll({
//     where: {
//       [uniqueKey]: {
//         [Op.in]: uniqueValues
//       }
//     },
//     attributes: [uniqueKey]
//   });

//   return new Set(existingRecords.map(record => record[uniqueKey]));
// };

// // Function to safely drop constraints before altering tables
// const dropConstraints = async () => {
//   const queryInterface = db.sequelize.getQueryInterface();
//   try {
//     const tables = await queryInterface.showAllTables();
    
//     for (const tableName of tables) {
//       const constraints = await queryInterface.getForeignKeyReferencesForTable(tableName);
      
//       for (const constraint of constraints) {
//         await queryInterface.removeConstraint(
//           tableName,
//           constraint.constraintName
//         ).catch(err => {
//           console.log(`Note: Constraint ${constraint.constraintName} may not exist on ${tableName}`);
//         });
//       }
//     }
//   } catch (err) {
//     console.log('Note: Some constraints may not exist or already be dropped');
//   }
// };

// // Function to validate and clean data before import
// const validateAndCleanData = async (data, model) => {
//   const modelAttributes = Object.keys(model.rawAttributes);
//   return data.map(row => {
//     const cleanRow = {};
//     for (const attr of modelAttributes) {
//       if (row.hasOwnProperty(attr)) {
//         // Convert empty strings to null for non-string fields
//         cleanRow[attr] = row[attr] === '' ? null : row[attr];
//       }
//     }
//     return cleanRow;
//   });
// };

// // Function to import data from a CSV file into the database
// const importDataFromCSV = async (filePath, model, uniqueKey, skipExisting = false) => {
//   try {
//     console.log(`Starting import for ${filePath}`);
//     const data = [];
    
//     // Read CSV file
//     await new Promise((resolve, reject) => {
//       fs.createReadStream(filePath)
//         .on('error', (error) => {
//           reject(new Error(`Error reading file ${filePath}: ${error.message}`));
//         })
//         .pipe(csv())
//         .on('data', (row) => data.push(row))
//         .on('end', resolve);
//     });

//     if (data.length === 0) {
//       console.log(`No data found in ${filePath}`);
//       return;
//     }

//     // Clean and validate data
//     const cleanedData = await validateAndCleanData(data, model);

//     // Check for existing records if skipExisting is true
//     let filteredData = cleanedData;
//     if (skipExisting) {
//       const existingRecords = await checkExistingRecords(model, uniqueKey, cleanedData);
//       filteredData = cleanedData.filter(item => !existingRecords.has(item[uniqueKey]));
//       console.log(`Skipping ${cleanedData.length - filteredData.length} existing records`);
//     }

//     // Remove duplicates based on uniqueKey
//     const uniqueData = Array.from(new Map(
//       filteredData.map(item => [item[uniqueKey], item])
//     ).values());

//     if (uniqueData.length === 0) {
//       console.log(`No new records to import for ${filePath}`);
//       return;
//     }

//     // Perform bulk insert in chunks
//     const chunkSize = 500;
//     for (let i = 0; i < uniqueData.length; i += chunkSize) {
//       const chunk = uniqueData.slice(i, i + chunkSize);
//       await model.bulkCreate(chunk, {
//         updateOnDuplicate: skipExisting ? [] : Object.keys(model.rawAttributes),
//         validate: true,
//         individualHooks: false
//       }).catch(async (err) => {
//         logError(`Error in chunk ${i}-${i+chunkSize} for ${filePath}: ${err.message}`);
//         // Try inserting records one by one in case of errors
//         for (const record of chunk) {
//           await model.upsert(record).catch(error => {
//             logError(`Failed to insert/update record ${JSON.stringify(record)}: ${error.message}`);
//           });
//         }
//       });
//     }

//     console.log(`Successfully imported ${uniqueData.length} records from ${filePath}`);
//   } catch (err) {
//     logError(`Error importing data from ${filePath}: ${err.message}`);
//     throw err;
//   }
// };

// // Main function to synchronize tables and import data
// const createTablesAndImportData = async () => {
//   let connection;
//   try {
//     // Create a new connection
//     connection = await db.sequelize.connectionManager.getConnection();
    
//     // Drop existing constraints
//     await dropConstraints();
    
//     // Sync tables without foreign key checks initially
//     await db.sequelize.query('SET CONSTRAINTS ALL DEFERRED;');
//     await db.sequelize.sync({ force: false, alter: true });
//     console.log('Tables synchronized successfully.');

//     // Import data in order of dependencies
//     // Note: Users table is excluded since it's already populated
//     const importSequence = [
//       { 
//         path: './DB/Categories_Table.csv', 
//         model: db.Category, 
//         key: 'category_id',
//         skipExisting: true  // Skip existing categories
//       },
//       { 
//         path: './DB/Products_Table.csv', 
//         model: db.Product, 
//         key: 'product_id',
//         skipExisting: false  // Update existing products if found
//       },
//       { 
//         path: './DB/Orders_Table.csv', 
//         model: db.Order, 
//         key: 'order_id',
//         skipExisting: true  // Skip existing orders
//       },
//       { 
//         path: './DB/Order_Items_Table.csv', 
//         model: db.OrderItem, 
//         key: 'order_item_id',
//         skipExisting: true  // Skip existing order items
//       },
//       { 
//         path: './DB/Shipping_Table.csv', 
//         model: db.Shipping, 
//         key: 'shipping_id',
//         skipExisting: true  // Skip existing shipping records
//       },
//       { 
//         path: './DB/Sales_Table.csv', 
//         model: db.Sale, 
//         key: 'sale_id',
//         skipExisting: true  // Skip existing sales
//       },
//       { 
//         path: './DB/Payments_Table.csv', 
//         model: db.Payment, 
//         key: 'payment_id',
//         skipExisting: true  // Skip existing payments
//       }
//     ];

//     for (const import_item of importSequence) {
//       console.log(`Importing ${import_item.path}...`);
//       await importDataFromCSV(
//         import_item.path, 
//         import_item.model, 
//         import_item.key, 
//         import_item.skipExisting
//       );
//     }

//     // Re-enable constraints after all data is imported
//     await db.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE;');
    
//     console.log('Data import complete successfully.');
//   } catch (err) {
//     console.error('Error during import process:', err);
//     logError(`Error during import process: ${err.message}`);
//   } finally {
//     // Release the connection properly
//     if (connection) {
//       try {
//         await connection.release();
//       } catch (err) {
//         console.error('Error releasing connection:', err);
//       }
//     }
//   }
// };

// // Execute the import with proper connection handling
// (async () => {
//   try {
//     await createTablesAndImportData();
//   } catch (err) {
//     console.error('Error syncing the database:', err);
//   } finally {
//     // Close the connection pool
//     try {
//       await db.sequelize.close();
//     } catch (err) {
//       console.error('Error closing database connection:', err);
//     }
//     process.exit(0);
//   }
// })();




// const fs = require('fs');
// const csv = require('csv-parser');
// const db = require('./models');
// const { Op } = require('sequelize');

// // Function to log errors to a file
// const logError = (message) => {
//   const timestamp = new Date().toISOString();
//   fs.appendFile('error.log', `[${timestamp}] ${message}\n`, (err) => {
//     if (err) console.error("Failed to write to log file:", err);
//   });
// };

// // Function to check existing records
// const checkExistingRecords = async (model, uniqueKey, data) => {
//   const uniqueValues = [...new Set(data.map(item => item[uniqueKey]))];
//   const existingRecords = await model.findAll({
//     where: {
//       [uniqueKey]: {
//         [Op.in]: uniqueValues
//       }
//     },
//     attributes: [uniqueKey]
//   });

//   return new Set(existingRecords.map(record => record[uniqueKey]));
// };

// // Function to safely drop constraints before altering tables
// const dropConstraints = async () => {
//   const queryInterface = db.sequelize.getQueryInterface();
//   try {
//     const tables = await queryInterface.showAllTables();
    
//     for (const tableName of tables) {
//       const constraints = await queryInterface.getForeignKeyReferencesForTable(tableName);
      
//       for (const constraint of constraints) {
//         await queryInterface.removeConstraint(
//           tableName,
//           constraint.constraintName
//         ).catch(err => {
//           console.log(`Note: Constraint ${constraint.constraintName} may not exist on ${tableName}`);
//         });
//       }
//     }
//   } catch (err) {
//     console.log('Note: Some constraints may not exist or already be dropped');
//   }
// };

// // Function to validate and clean data before import
// const validateAndCleanData = async (data, model) => {
//   const modelAttributes = Object.keys(model.rawAttributes);
//   return data.map(row => {
//     const cleanRow = {};
//     for (const attr of modelAttributes) {
//       if (row.hasOwnProperty(attr)) {
//         // Convert empty strings to null for non-string fields
//         cleanRow[attr] = row[attr] === '' ? null : row[attr];
//       }
//     }
//     return cleanRow;
//   });
// };

// // Function to import data from a CSV file into the database
// const importDataFromCSV = async (filePath, model, uniqueKey, skipExisting = false) => {
//   try {
//     console.log(`Starting import for ${filePath}`);
//     const data = [];
    
//     // Read CSV file
//     await new Promise((resolve, reject) => {
//       fs.createReadStream(filePath)
//         .on('error', (error) => {
//           reject(new Error(`Error reading file ${filePath}: ${error.message}`));
//         })
//         .pipe(csv())
//         .on('data', (row) => data.push(row))
//         .on('end', resolve);
//     });

//     if (data.length === 0) {
//       console.log(`No data found in ${filePath}`);
//       return;
//     }

//     // Clean and validate data
//     const cleanedData = await validateAndCleanData(data, model);

//     // Check for existing records if skipExisting is true
//     let filteredData = cleanedData;
//     if (skipExisting) {
//       const existingRecords = await checkExistingRecords(model, uniqueKey, cleanedData);
//       filteredData = cleanedData.filter(item => !existingRecords.has(item[uniqueKey]));
//       console.log(`Skipping ${cleanedData.length - filteredData.length} existing records`);
//     }

//     // Remove duplicates based on uniqueKey
//     const uniqueData = Array.from(new Map(
//       filteredData.map(item => [item[uniqueKey], item])
//     ).values());

//     if (uniqueData.length === 0) {
//       console.log(`No new records to import for ${filePath}`);
//       return;
//     }

//     // Perform bulk insert in chunks
//     const chunkSize = 500;
//     for (let i = 0; i < uniqueData.length; i += chunkSize) {
//       const chunk = uniqueData.slice(i, i + chunkSize);
//       try {
//         await model.bulkCreate(chunk, {
//           updateOnDuplicate: skipExisting ? [] : Object.keys(model.rawAttributes),
//           validate: true,
//           individualHooks: false
//         });
//         console.log(`Imported chunk ${i}-${i+chunkSize} of ${uniqueData.length} records`);
//       } catch (err) {
//         logError(`Error in chunk ${i}-${i+chunkSize} for ${filePath}: ${err.message}`);
//         // Try inserting records one by one in case of errors
//         for (const record of chunk) {
//           try {
//             await model.upsert(record);
//           } catch (error) {
//             logError(`Failed to insert/update record ${JSON.stringify(record)}: ${error.message}`);
//           }
//         }
//       }
//     }

//     console.log(`Successfully imported ${uniqueData.length} records from ${filePath}`);
//   } catch (err) {
//     logError(`Error importing data from ${filePath}: ${err.message}`);
//     throw err;
//   }
// };

// // Main function to synchronize tables and import data
// const createTablesAndImportData = async () => {
//   try {
//     // Sync tables without foreign key checks initially
//     await db.sequelize.query('SET CONSTRAINTS ALL DEFERRED;');
    
//     // Sync tables
//     await db.sequelize.sync({ force: false, alter: true });
//     console.log('Tables synchronized successfully.');

//     // Import data in order of dependencies
//     const importSequence = [
//       { 
//         path: './DB/Categories_Table.csv', 
//         model: db.Category, 
//         key: 'category_id',
//         skipExisting: true
//       },
//       { 
//         path: './DB/Products_Table.csv', 
//         model: db.Product, 
//         key: 'product_id',
//         skipExisting: false  // Allow updates for products
//       },
//       { 
//         path: './DB/Orders_Table.csv', 
//         model: db.Order, 
//         key: 'order_id',
//         skipExisting: true
//       },
//       { 
//         path: './DB/Order_Items_Table.csv', 
//         model: db.OrderItem, 
//         key: 'order_item_id',
//         skipExisting: true
//       },
//       { 
//         path: './DB/Shipping_Table.csv', 
//         model: db.Shipping, 
//         key: 'shipping_id',
//         skipExisting: true
//       },
//       { 
//         path: './DB/Sales_Table.csv', 
//         model: db.Sale, 
//         key: 'sale_id',
//         skipExisting: true
//       },
//       { 
//         path: './DB/Payments_Table.csv', 
//         model: db.Payment, 
//         key: 'payment_id',
//         skipExisting: true
//       }
//     ];

//     for (const import_item of importSequence) {
//       console.log(`Importing ${import_item.path}...`);
//       await importDataFromCSV(
//         import_item.path, 
//         import_item.model, 
//         import_item.key, 
//         import_item.skipExisting
//       );
//     }

//     // Re-enable constraints after all data is imported
//     await db.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE;');
    
//     console.log('Data import complete successfully.');
//   } catch (err) {
//     console.error('Error during import process:', err);
//     logError(`Error during import process: ${err.message}`);
//   }
// };

// // Execute the import with proper connection handling
// (async () => {
//   try {
//     await createTablesAndImportData();
//   } catch (err) {
//     console.error('Error syncing the database:', err);
//   } finally {
//     try {
//       // Close database connection
//       await db.sequelize.close();
//       console.log('Database connection closed successfully');
//     } catch (err) {
//       console.error('Error closing database connection:', err);
//     }
//     process.exit(0);
//   }
// })();


// const fs = require('fs');
// const csv = require('csv-parser');
// const db = require('./models');
// const { Op } = require('sequelize');
// const crypto = require('crypto');

// // Function to log errors to a file
// const logError = (message) => {
//   const timestamp = new Date().toISOString();
//   fs.appendFile('error.log', `[${timestamp}] ${message}\n`, (err) => {
//     if (err) console.error("Failed to write to log file:", err);
//   });
// };

// // Function to create a basic hash
// const createHash = (password) => {
//   return crypto
//     .createHash('sha256')
//     .update(password)
//     .digest('hex');
// };

// // Function to read CSV file
// const readCSV = async (filePath) => {
//   const data = [];
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .on('error', (error) => reject(new Error(`Error reading file ${filePath}: ${error.message}`)))
//       .pipe(csv())
//       .on('data', (row) => data.push(row))
//       .on('end', () => resolve(data));
//   });
// };

// // Function to import data in chunks
// const importInChunks = async (model, data, uniqueKey, batchSize = 100) => {
//   try {
//     for (let i = 0; i < data.length; i += batchSize) {
//       const chunk = data.slice(i, Math.min(i + batchSize, data.length));
//       await model.bulkCreate(chunk, {
//         updateOnDuplicate: [uniqueKey],
//         validate: true
//       });
//       console.log(`Imported records ${i + 1} to ${Math.min(i + batchSize, data.length)}`);
//     }
//   } catch (err) {
//     logError(`Error in bulk create: ${err.message}`);
//     console.log('Falling back to individual inserts...');
    
//     for (const record of data) {
//       try {
//         await model.upsert(record);
//       } catch (err) {
//         logError(`Failed to insert record ${JSON.stringify(record)}: ${err.message}`);
//       }
//     }
//   }
// };

// const mapUserData = (userData) => {
//     return userData.map(user => ({
//       user_id: user.user_id,
//       username: user.username,
//       password_hash: createHash(user.password_hash || 'defaultPassword123'),
//       first_name: user.first_name,
//       last_name: user.last_name,
//       created_at: user.created_at ? new Date(user.created_at) : new Date(),
//       is_active: user.is_active?.toLowerCase() === 'true',
//       updated_at: user.updated_at ? new Date(user.updated_at) : new Date()
//     }));
//   };
  
//   // Function to keep only first occurrence of users based on username
//   const getUniqueUsers = (users) => {
//     const uniqueUsersByUsername = new Map();
//     const result = [];
//     const skipped = [];
  
//     users.forEach(user => {
//       if (!uniqueUsersByUsername.has(user.username)) {
//         uniqueUsersByUsername.set(user.username, user);
//         result.push(user);
//       } else {
//         skipped.push({
//           user_id: user.user_id,
//           username: user.username,
//           reason: 'Duplicate username'
//         });
//       }
//     });
  
//     // Log skipped records
//     if (skipped.length > 0) {
//       logImportedData(skipped, 'Skipped Users');
//       console.log('\nSkipped duplicate users:');
//       skipped.forEach(record => {
//         console.log(`User ID: ${record.user_id}, ${record.reason}: ${record.username}`);
//       });
//     }
  
//     return result;
//   };

// // Main import function
// const importAllData = async () => {
//   try {
//     // Disable foreign key checks
//     await db.sequelize.query('SET CONSTRAINTS ALL DEFERRED;');
    
//     const importSequence = [
//     //   {
//     //     name: 'Users',
//     //     model: db.User,
//     //     file: './DB/Users_Table.csv',
//     //     uniqueKey: 'user_id',
//     //     transform: (row) => ({
//     //       ...row,
//     //       password_hash: createHash(row.password || 'defaultPassword123'),
//     //       created_at: new Date(),
//     //       updated_at: new Date()
//     //     })
//     //   },
//     {
//         name: 'Users',
//         model: db.User,
//         file: './DB/Users_Table.csv',
//         uniqueKey: 'user_id',
//         transform: (row) => ({
//           user_id: row.user_id,
//           username: row.username,
//           password_hash: row.password_hash,  // Use existing hash from CSV
//           first_name: row.first_name,
//           last_name: row.last_name,
//           created_at: row.created_at ? new Date(row.created_at) : new Date(),
//           is_active: row.is_active?.toLowerCase() === 'true',
//           updated_at: row.updated_at ? new Date(row.updated_at) : new Date()
//         })
//       },
//       {
//         name: 'Categories',
//         model: db.Category,
//         file: './DB/Categories_Table.csv',
//         uniqueKey: 'category_id'
//       },
//       {
//         name: 'Products',
//         model: db.Product,
//         file: './DB/Products_Table.csv',
//         uniqueKey: 'product_id'
//       },
//       {
//         name: 'Orders',
//         model: db.Order,
//         file: './DB/Orders_Table.csv',
//         uniqueKey: 'order_id',
//         transform: (row) => ({
//           ...row,
//           order_date: new Date(row.order_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'OrderItems',
//         model: db.OrderItem,
//         file: './DB/Order_Items_Table.csv',
//         uniqueKey: 'order_item_id',
//         transform: (row) => ({
//           ...row,
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'Shipping',
//         model: db.Shipping,
//         file: './DB/Shipping_Table.csv',
//         uniqueKey: 'shipping_id',
//         transform: (row) => ({
//           ...row,
//           shipping_date: new Date(row.shipping_date),
//           delivery_date: new Date(row.delivery_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'Sales',
//         model: db.Sale,
//         file: './DB/Sales_Table.csv',
//         uniqueKey: 'sale_id',
//         transform: (row) => ({
//           ...row,
//           sale_date: new Date(row.sale_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'Payments',
//         model: db.Payment,
//         file: './DB/Payments_Table.csv',
//         uniqueKey: 'payment_id',
//         transform: (row) => ({
//           ...row,
//           payment_date: new Date(row.payment_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       }
//     ];

//     // Process each table
//     for (const item of importSequence) {
//       console.log(`\nProcessing ${item.name}...`);
      
//       // Read data
//       let data = await readCSV(item.file);
//       console.log(`Read ${data.length} records from ${item.file}`);

//       // Transform data if needed
//       if (item.transform) {
//         data = data.map(item.transform);
//       }

//       // Clean data
//       data = data.map(record => {
//         const cleanRecord = {};
//         for (const [key, value] of Object.entries(record)) {
//           cleanRecord[key] = value === '' ? null : value;
//         }
//         return cleanRecord;
//       });

//       // Import data
//       await importInChunks(item.model, data, item.uniqueKey);
//       console.log(`Completed ${item.name} import`);
//     }

//     // Re-enable constraints
//     await db.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE;');
    
//     console.log('\nData import completed successfully');
//   } catch (err) {
//     console.error('Error during import:', err);
//     logError(`Import process error: ${err.message}`);
//   } finally {
//     await db.sequelize.close();
//   }
// };

// // Execute the import
// importAllData().catch(err => {
//   console.error('Fatal error during import:', err);
//   process.exit(1);
// });

// const fs = require('fs');
// const csv = require('csv-parser');
// const db = require('./models');
// const { Op } = require('sequelize');

// // Function to log errors to a file
// const logError = (message) => {
//   const timestamp = new Date().toISOString();
//   fs.appendFile('error.log', `[${timestamp}] ${message}\n`, (err) => {
//     if (err) console.error("Failed to write to log file:", err);
//   });
// };

// // Function to read CSV file
// const readCSV = async (filePath) => {
//   const data = [];
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .on('error', (error) => reject(new Error(`Error reading file ${filePath}: ${error.message}`)))
//       .pipe(csv())
//       .on('data', (row) => data.push(row))
//       .on('end', () => resolve(data));
//   });
// };

// // Function to keep only first occurrence of users based on username and email
// const getUniqueUsers = (users) => {
//   const uniqueUsersByUsername = new Map();
//   const result = [];
//   const skipped = [];

//   users.forEach(user => {
//     // Skip users without required fields
//     if (!user.username || !user.email) {
//       skipped.push({
//         user_id: user.user_id,
//         username: user.username,
//         reason: 'Missing required fields'
//       });
//       return;
//     }

//     // Skip if username is already seen
//     if (!uniqueUsersByUsername.has(user.username)) {
//       uniqueUsersByUsername.set(user.username, user);
//       result.push(user);
//     } else {
//       skipped.push({
//         user_id: user.user_id,
//         username: user.username,
//         reason: 'Duplicate username'
//       });
//       logError(`Skipping duplicate user: ID ${user.user_id}, username ${user.username}`);
//     }
//   });

//   if (skipped.length > 0) {
//     console.log('\nSkipped users:', skipped);
//   }

//   return result;
// };

// // Function to import data in chunks
// const importInChunks = async (model, data, uniqueKey, batchSize = 100) => {
//   try {
//     for (let i = 0; i < data.length; i += batchSize) {
//       const chunk = data.slice(i, Math.min(i + batchSize, data.length));
//       try {
//         await model.bulkCreate(chunk, {
//           validate: true
//         });
//         console.log(`Imported records ${i + 1} to ${Math.min(i + batchSize, data.length)}`);
//       } catch (err) {
//         logError(`Error in bulk create: ${err.message}`);
//         // Try individual inserts
//         for (const record of chunk) {
//           try {
//             await model.create(record);
//           } catch (error) {
//             logError(`Failed to insert record ${JSON.stringify(record)}: ${error.message}`);
//           }
//         }
//       }
//     }
//   } catch (err) {
//     logError(`Error in importInChunks: ${err.message}`);
//     throw err;
//   }
// };

// // Main import function
// const importAllData = async () => {
//   try {
//     // Disable foreign key checks
//     await db.sequelize.query('SET CONSTRAINTS ALL DEFERRED;');

//     const importSequence = [
//       {
//         name: 'Users',
//         model: db.User,
//         file: './DB/Users_Table.csv',
//         uniqueKey: 'user_id',
//         transform: (row) => ({
//           user_id: row.user_id,
//           username: row.username,
//           email: row.email,
//           password_hash: row.password_hash,
//           first_name: row.first_name,
//           last_name: row.last_name,
//           created_at: row.created_at ? new Date(row.created_at) : new Date(),
//           is_active: row.is_active?.toLowerCase() === 'true',
//           updated_at: row.updated_at ? new Date(row.updated_at) : new Date()
//         })
//       },
//       {
//         name: 'Categories',
//         model: db.Category,
//         file: './DB/Categories_Table.csv',
//         uniqueKey: 'category_id'
//       },
//       {
//         name: 'Products',
//         model: db.Product,
//         file: './DB/Products_Table.csv',
//         uniqueKey: 'product_id'
//       },
//       {
//         name: 'Orders',
//         model: db.Order,
//         file: './DB/Orders_Table.csv',
//         uniqueKey: 'order_id',
//         transform: (row) => ({
//           ...row,
//           order_date: new Date(row.order_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'OrderItems',
//         model: db.OrderItem,
//         file: './DB/Order_Items_Table.csv',
//         uniqueKey: 'order_item_id',
//         transform: (row) => ({
//           ...row,
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'Shipping',
//         model: db.Shipping,
//         file: './DB/Shipping_Table.csv',
//         uniqueKey: 'shipping_id',
//         transform: (row) => ({
//           ...row,
//           shipping_date: new Date(row.shipping_date),
//           delivery_date: new Date(row.delivery_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'Sales',
//         model: db.Sale,
//         file: './DB/Sales_Table.csv',
//         uniqueKey: 'sale_id',
//         transform: (row) => ({
//           ...row,
//           sale_date: new Date(row.sale_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       },
//       {
//         name: 'Payments',
//         model: db.Payment,
//         file: './DB/Payments_Table.csv',
//         uniqueKey: 'payment_id',
//         transform: (row) => ({
//           ...row,
//           payment_date: new Date(row.payment_date),
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//       }
//     ];

//     // Process each table
//     for (const item of importSequence) {
//       console.log(`\nProcessing ${item.name}...`);
      
//       // Read data
//       let data = await readCSV(item.file);
//       console.log(`Read ${data.length} records from ${item.file}`);

//       // Transform data if needed
//       if (item.transform) {
//         data = data.map(item.transform);
//       }

//       // Clean data
//       data = data.map(record => {
//         const cleanRecord = {};
//         for (const [key, value] of Object.entries(record)) {
//           cleanRecord[key] = value === '' ? null : value;
//         }
//         return cleanRecord;
//       });

//       // Handle uniqueness for Users table
//       if (item.name === 'Users') {
//         const uniqueUsers = getUniqueUsers(data);
//         console.log(`Found ${data.length} total users, ${uniqueUsers.length} unique users`);
//         data = uniqueUsers;
//       }

//       // Import data
//       await importInChunks(item.model, data, item.uniqueKey);
//       console.log(`Completed ${item.name} import`);
//     }

//     // Re-enable constraints
//     await db.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE;');
    
//     console.log('\nData import completed successfully');
//   } catch (err) {
//     console.error('Error during import:', err);
//     logError(`Import process error: ${err.message}`);
//   } finally {
//     await db.sequelize.close();
//   }
// };

// // Execute the import
// importAllData().catch(err => {
//   console.error('Fatal error during import:', err);
//   process.exit(1);
// });

const fs = require('fs');
const csv = require('csv-parser');
const db = require('./models');
const { Op } = require('sequelize');

// Function to log errors to a file
const logError = (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFile('error.log', `[${timestamp}] ${message}\n`, (err) => {
    if (err) console.error("Failed to write to log file:", err);
  });
};

// Function to read CSV file
const readCSV = async (filePath) => {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .on('error', (error) => reject(new Error(`Error reading file ${filePath}: ${error.message}`)))
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data));
  });
};

// Function to process users - only users need uniqueness check
const processUsers = (users) => {
  const uniqueUsersByUsername = new Map();
  const result = [];

  users.forEach(user => {
    if (!uniqueUsersByUsername.has(user.username)) {
      uniqueUsersByUsername.set(user.username, user);
      result.push(user);
    } else {
      logError(`Skipping duplicate user: ID ${user.user_id}, username ${user.username}`);
    }
  });

  return result;
};

// Function to import users with uniqueness check
const importUsers = async (userData) => {
  try {
    const transformedUsers = userData.map(user => ({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at ? new Date(user.created_at) : new Date(),
      is_active: user.is_active?.toLowerCase() === 'true',
      updated_at: user.updated_at ? new Date(user.updated_at) : new Date()
    }));

    const uniqueUsers = processUsers(transformedUsers);
    console.log(`Processing ${userData.length} total users, ${uniqueUsers.length} unique users`);

    for (const user of uniqueUsers) {
      try {
        await db.User.create(user);
      } catch (err) {
        logError(`Failed to insert user ${JSON.stringify(user)}: ${err.message}`);
      }
    }
  } catch (err) {
    logError(`Error importing users: ${err.message}`);
    throw err;
  }
};

// Function to import other tables - no uniqueness check needed
const importTable = async (model, data, tableName) => {
  try {
    // Try batch insert first
    try {
      await model.bulkCreate(data, {
        validate: true,
        // For PostgreSQL, use the native COPY command if available
        ...(db.sequelize.options.dialect === 'postgres' ? { 
          postgres: { copyFromClient: true } 
        } : {})
      });
      console.log(`Successfully batch imported ${data.length} records to ${tableName}`);
    } catch (err) {
      logError(`Bulk import failed for ${tableName}, attempting individual inserts: ${err.message}`);
      
      // If bulk insert fails, try individual inserts
      for (const record of data) {
        try {
          await model.create(record);
        } catch (error) {
          logError(`Failed to insert record in ${tableName}: ${JSON.stringify(record)}: ${error.message}`);
        }
      }
    }
  } catch (err) {
    logError(`Error importing ${tableName}: ${err.message}`);
  }
};

// Main import function
const importAllData = async () => {
  let transaction;
  
  try {
    // Start a transaction
    transaction = await db.sequelize.transaction();

    // Defer all constraints during import
    await db.sequelize.query('SET CONSTRAINTS ALL DEFERRED', { transaction });

    // First import users with uniqueness check
    console.log('\nProcessing Users...');
    const userData = await readCSV('./DB/Users_Table.csv');
    await importUsers(userData);

    // Import other tables without uniqueness checks
    const otherTables = [
      {
        name: 'Categories',
        model: db.Category,
        file: './DB/Categories_Table.csv'
      },
      {
        name: 'Products',
        model: db.Product,
        file: './DB/Products_Table.csv'
      },
      {
        name: 'Orders',
        model: db.Order,
        file: './DB/Orders_Table.csv',
        transform: (row) => ({
          ...row,
          order_date: new Date(row.order_date),
          created_at: new Date(),
          updated_at: new Date()
        })
      },
      {
        name: 'OrderItems',
        model: db.OrderItem,
        file: './DB/Order_Items_Table.csv',
        transform: (row) => ({
          ...row,
          created_at: new Date(),
          updated_at: new Date()
        })
      },
      {
        name: 'Shipping',
        model: db.Shipping,
        file: './DB/Shipping_Table.csv',
        transform: (row) => ({
          ...row,
          shipping_date: new Date(row.shipping_date),
          delivery_date: new Date(row.delivery_date),
          created_at: new Date(),
          updated_at: new Date()
        })
      },
      {
        name: 'Sales',
        model: db.Sale,
        file: './DB/Sales_Table.csv',
        transform: (row) => ({
          ...row,
          sale_date: new Date(row.sale_date),
          created_at: new Date(),
          updated_at: new Date()
        })
      },
      {
        name: 'Payments',
        model: db.Payment,
        file: './DB/Payments_Table.csv',
        transform: (row) => ({
          ...row,
          payment_date: new Date(row.payment_date),
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    ];

    // Process each table without uniqueness checks
    for (const table of otherTables) {
      console.log(`\nProcessing ${table.name}...`);
      
      let data = await readCSV(table.file);
      console.log(`Read ${data.length} records from ${table.file}`);

      // Transform data if needed
      if (table.transform) {
        data = data.map(table.transform);
      }

      // Import all records without uniqueness check
      await importTable(table.model, data, table.name);
    }

    // Re-enable constraints
    await db.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE', { transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    console.log('\nData import completed successfully');
  } catch (err) {
    console.error('Error during import:', err);
    logError(`Import process error: ${err.message}`);
    
    // Rollback on error
    if (transaction) await transaction.rollback();
  } finally {
    await db.sequelize.close();
  }
};

// Execute the import
importAllData().catch(err => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
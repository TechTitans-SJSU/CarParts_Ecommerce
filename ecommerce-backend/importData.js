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
        name: 'Parts',
        model: db.Part,
        file: './DB/Parts_Table.csv'
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

exports.importAllData = importAllData;
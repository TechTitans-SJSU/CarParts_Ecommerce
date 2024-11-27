const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,  // Ensure usernames are unique
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,  // Ensure emails are unique
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,  // Hashed password for security
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: true,  // Optional first name
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: true,  // Optional last name
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Default to current timestamp
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,  // Default to active
  },
}, {
  tableName: 'Users',  // Ensure it matches the actual table name in PostgreSQL
  timestamps: false,  // Disable automatic Sequelize timestamps
});

module.exports = User;

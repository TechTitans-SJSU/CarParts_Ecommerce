const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: DataTypes.STRING(255),
    allowNull: false,  
  },
}, {
  tableName: 'Category',  
  timestamps: false,  
});

module.exports = Category;

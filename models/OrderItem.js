const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/db');
const Product = require('./Product'); 

const OrderItem = dbConnection.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'order_items',
});

OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = OrderItem;

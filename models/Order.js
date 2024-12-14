const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/db');
const OrderItem = require('./OrderItem');
const Product = require('./Product');

const Order = dbConnection.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  buyer_info: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('compra', 'venta'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: dbConnection.literal('CURRENT_TIMESTAMP'),
  },
}, {
  timestamps: true,
  tableName: 'orders',
});
// models/Order.js

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { as: 'order', foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { as: 'productInfo', foreignKey: 'product_id' });



module.exports = Order;




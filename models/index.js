const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Database connection configuration
const dbConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Changed to console.log for better debugging
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const Supplier = require('./Supplier');
const Product = require('./Product');
const Client = require('./Client');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Initialize models
const models = {
  SupplierModel: Supplier(dbConnection, DataTypes),
  ProductModel: Product(dbConnection, DataTypes),
  ClientModel: Client(dbConnection, DataTypes),
  OrderModel: Order(dbConnection, DataTypes),
  OrderItemModel: OrderItem(dbConnection, DataTypes)
};

// Define relationships between models
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await dbConnection.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  dbConnection,
  testConnection,
  ...models
};


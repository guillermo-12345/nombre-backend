const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const dbConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  logging: (msg) => console.log(`[Database] ${msg}`)
});

// Import models
const Product = require('./Product');
const Supplier = require('./Supplier');
const Client = require('./Client');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Initialize models
const ProductModel = Product(dbConnection, Sequelize.DataTypes);
const SupplierModel = Supplier(dbConnection, Sequelize.DataTypes);
const ClientModel = Client(dbConnection, Sequelize.DataTypes);
const OrderModel = Order(dbConnection, Sequelize.DataTypes);
const OrderItemModel = OrderItem(dbConnection, Sequelize.DataTypes);

// Define relationships
OrderItemModel.belongsTo(OrderModel, { foreignKey: 'order_id', as: 'order' });
OrderItemModel.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product' });
OrderModel.hasMany(OrderItemModel, { foreignKey: 'order_id', as: 'items' });
ProductModel.hasMany(OrderItemModel, { foreignKey: 'product_id' });
OrderModel.belongsTo(ClientModel, { foreignKey: 'clientId' });
ClientModel.hasMany(OrderModel, { foreignKey: 'clientId' });
ProductModel.belongsTo(SupplierModel, { foreignKey: 'supplierId' });
SupplierModel.hasMany(ProductModel, { foreignKey: 'supplierId' });

module.exports = {
  dbConnection,
  ProductModel,
  SupplierModel,
  ClientModel,
  OrderModel,
  OrderItemModel
};


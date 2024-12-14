const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configuración de conexión a la base de datos
const dbConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Importar modelos
const Supplier = require('./Supplier');
const Product = require('./Product');
const Client = require('./Client');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Inicializar modelos
const SupplierModel = Supplier(dbConnection, DataTypes);
const ProductModel = Product(dbConnection, DataTypes);
const ClientModel = Client(dbConnection, DataTypes);
const OrderModel = Order(dbConnection, DataTypes);
const OrderItemModel = OrderItem(dbConnection, DataTypes);

// Definir relaciones entre los modelos
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
  SupplierModel,
  ProductModel,
  ClientModel,
  OrderModel,
  OrderItemModel,
};

const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/db');

const Product = dbConnection.define('Product', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'suppliers',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'products',
  timestamps: true,
});

Product.associate = (models) => {
  Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
};

module.exports = Product;


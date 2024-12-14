const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/db');

const Supplier = dbConnection.define('Supplier', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  hooks: {
    beforeDestroy: async (supplier) => {
      const Product = require('./Product')(sequelize, DataTypes);
      await Product.destroy({
        where: { supplierId: supplier.id }
      });
    }
  }
});

module.exports = Supplier;

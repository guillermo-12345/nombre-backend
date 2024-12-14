const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/db');

const Client = dbConnection.define('Client', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuit: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'clients',
  timestamps: false });

module.exports = Client;


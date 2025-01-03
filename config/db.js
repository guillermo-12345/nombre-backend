const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  dialectOptions: {
    connectTimeout: 60000, // Tiempo de espera extendido
  },
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

const testConnection = async () => {
  try {
    await dbConnection.authenticate();
    console.log('[Database] Connection successful');
    return true;
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    return false;
  }
};

module.exports = { dbConnection, testConnection };

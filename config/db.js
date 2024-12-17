const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

console.log('[Database] Initializing connection...');

const dbConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000
  },
  logging: (msg) => console.log(`[Database] ${msg}`),
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});

const testConnection = async () => {
  try {
    await dbConnection.authenticate();
    console.log('[Database] Connection successful');
    return true;
  } catch (error) {
    console.error('[Database] Connection test failed:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    return false;
  }
};

const initializeDatabase = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    await dbConnection.sync({ force: false });
    console.log('[Database] Models synchronized');
    return true;
  } catch (error) {
    console.error('[Database] Initialization failed:', error);
    throw error;
  }
};

module.exports = {
  dbConnection,
  testConnection,
  initializeDatabase
};


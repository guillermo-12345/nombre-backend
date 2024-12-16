const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: (msg) => console.log(`[Database] ${msg}`),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection function
const testConnection = async () => {
  try {
    await dbConnection.authenticate();
    console.log('[Database] Connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('[Database] Unable to connect:', error);
    return false;
  }
};

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await testConnection();
    // Sync models with database
    await dbConnection.sync();
    console.log('[Database] Models synchronized successfully');
  } catch (error) {
    console.error('[Database] Initialization error:', error);
    throw error;
  }
};

module.exports = {
  dbConnection,
  testConnection,
  initializeDatabase
};


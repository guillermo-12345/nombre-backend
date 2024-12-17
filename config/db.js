const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const dbConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000,
    // SSL is disabled as per your Google Cloud SQL configuration
    ssl: null
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
    console.log('[Database] Testing connection with following config:');
    console.log('[Database] Host:', dbConnection.config.host);
    console.log('[Database] Port:', dbConnection.config.port);
    console.log('[Database] Database:', dbConnection.config.database);
    
    await dbConnection.authenticate();
    console.log('[Database] Authentication successful');

    return true;
  } catch (error) {
    console.error('[Database] Connection test failed:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    return false;
  }
};

const initializeDatabase = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Database] Initialization attempt ${i + 1} of ${retries}`);
      
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection test failed');
      }

      console.log('[Database] Initialization successful');
      return true;
    } catch (error) {
      console.error(`[Database] Initialization attempt ${i + 1} failed:`, error);
      
      if (i === retries - 1) {
        throw error;
      }
      
      const delay = Math.pow(2, i) * 1000;
      console.log(`[Database] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = {
  dbConnection,
  testConnection,
  initializeDatabase
};


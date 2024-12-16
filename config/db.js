const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

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

// Enhanced database connection test
const testConnection = async () => {
  try {
    await dbConnection.authenticate();
    console.log('[Database] Connection established successfully');
    
    // Test query to verify full database access
    await dbConnection.query('SELECT NOW()');
    console.log('[Database] Query execution verified');
    
    return true;
  } catch (error) {
    console.error('[Database] Connection error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    return false;
  }
};

// Database initialization with retries
const initializeDatabase = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Database connection test failed');
      }

      await dbConnection.sync();
      console.log('[Database] Models synchronized successfully');
      return true;
    } catch (error) {
      console.error(`[Database] Initialization attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

module.exports = {
  dbConnection,
  testConnection,
  initializeDatabase
};


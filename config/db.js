const { Sequelize } = require('sequelize');
require('dotenv').config();

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// Parse DATABASE_URL to validate format
try {
  const url = new URL(process.env.DATABASE_URL);
  console.log('[Database] Validated database URL format');
} catch (error) {
  console.error('[Database] Invalid DATABASE_URL format:', error.message);
  throw error;
}

const dbConnection = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000 // Increase connection timeout
  },
  logging: (msg) => console.log(`[Database] ${msg}`),
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // Increase acquire timeout
    idle: 10000
  },
  retry: {
    max: 3, // Maximum number of connection retries
    timeout: 60000 // Retry timeout
  }
});

const testConnection = async () => {
  try {
    // Basic connection test
    await dbConnection.authenticate();
    console.log('[Database] Authentication successful');

    // Test query execution
    const [results] = await dbConnection.query('SELECT NOW()');
    console.log('[Database] Query test successful:', results);

    // Test model synchronization
    await dbConnection.sync({ force: false });
    console.log('[Database] Model synchronization successful');

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

// Initialize database with retries
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


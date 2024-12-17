const { Sequelize } = require('sequelize');
require('dotenv').config();

// This should be your new production DATABASE_URL
const productionUrl = process.env.PRODUCTION_DATABASE_URL;

if (!productionUrl) {
  console.error('PRODUCTION_DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function testProductionConnection() {
  const sequelize = new Sequelize(productionUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log
  });

  try {
    await sequelize.authenticate();
    console.log('Successfully connected to production database!');
    
    // Test query
    const [results] = await sequelize.query('SELECT NOW()');
    console.log('Test query successful:', results);
    
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to production database:', error);
  }
}

testProductionConnection();


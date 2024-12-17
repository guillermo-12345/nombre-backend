const { testConnection } = require('../config/db');

async function testMySQLConnection() {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('Successfully connected to MySQL database!');
    } else {
      console.log('Failed to connect to MySQL database.');
    }
  } catch (error) {
    console.error('Error testing MySQL connection:', error);
  }
}

testMySQLConnection();


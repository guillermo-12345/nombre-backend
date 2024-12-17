const { testConnection } = require('../config/db');

async function testCloudConnection() {
  try {
    console.log('Testing connection to Google Cloud SQL...');
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('Successfully connected to Google Cloud SQL database!');
    } else {
      console.log('Failed to connect to Google Cloud SQL database.');
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    if (error.original) {
      console.error('Original error:', error.original);
    }
  } finally {
    process.exit();
  }
}

testCloudConnection();


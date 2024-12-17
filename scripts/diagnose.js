const mysql = require('mysql2/promise');
require('dotenv').config();

async function runDiagnostics() {
  console.log('Starting diagnostics...');
  console.log('\nEnvironment Variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  try {
    // Parse DATABASE_URL
    const dbUrl = new URL(process.env.DATABASE_URL);
    const connection = await mysql.createConnection({
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.substr(1),
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('\nTesting database connection...');
    await connection.connect();
    console.log('✓ Database connection successful');

    // Test query
    console.log('\nTesting simple query...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✓ Query successful:', rows);

    // Test products table
    console.log('\nTesting products table...');
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log('✓ Products table accessible. Count:', products[0].count);

    await connection.end();
  } catch (error) {
    console.error('\n❌ Error during diagnostics:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}

runDiagnostics();


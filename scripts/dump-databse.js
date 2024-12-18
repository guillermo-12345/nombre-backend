const { exec } = require('child_process');
const path = require('path');

// Update these with your local database details
const DB_NAME = 'equipo1_ecommerce';
const DB_USER = 'root';
const DB_PASSWORD = 'pass';
const DB_HOST = '34.39.135.236';
const DB_PORT = '3306';

const dumpFile = path.join(__dirname, 'database-dump.sql');

const command = `pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -F p -b -v -f ${dumpFile} ${DB_NAME}`;

console.log('Starting database dump...');
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Error dumping database:', error);
    return;
  }
  console.log('Database dump completed successfully!');
  console.log('Output:', stdout);
  if (stderr) {
    console.error('Warnings:', stderr);
  }
});


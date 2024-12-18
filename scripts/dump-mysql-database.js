const { exec } = require('child_process');
const path = require('path');

// Update these with your MySQL database details
const DB_NAME = 'equipo1_ecommerce';
const DB_USER = 'root';
const DB_PASSWORD = 'pass';
const DB_HOST = '34.39.135.236';
const DB_PORT = '3306';

const dumpFile = path.join(__dirname, 'mysql-database-dump.sql');

const command = `mysqldump -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${dumpFile}`;

console.log('Starting MySQL database dump...');
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Error dumping MySQL database:', error);
    return;
  }
  console.log('MySQL database dump completed successfully!');
  console.log('Output:', stdout);
  if (stderr) {
    console.error('Warnings:', stderr);
  }
});


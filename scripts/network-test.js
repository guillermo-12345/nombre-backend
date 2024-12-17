const net = require('net');

function testDatabaseConnection() {
  const host = '34.39.135.236';
  const port = 3306;

  console.log(`Testing connection to ${host}:${port}...`);

  const socket = new net.Socket();
  
  socket.setTimeout(5000); // 5 second timeout

  socket.on('connect', () => {
    console.log('TCP connection successful!');
    socket.destroy();
  });

  socket.on('timeout', () => {
    console.error('Connection timed out');
    socket.destroy();
  });

  socket.on('error', (error) => {
    console.error('Connection error:', error);
  });

  socket.on('close', () => {
    console.log('Connection closed');
    process.exit();
  });

  socket.connect(port, host);
}

testDatabaseConnection();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoute');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const clientRoutes = require('./routes/clientRoutes');
const profileRoutes = require('./routes/profileRoutes');
const emailRoutes = require('./routes/emailRoutes');
const purchaseRoutes = require('./routes/purchasesRoutes');
const { initializeDatabase, testConnection } = require('./config/db');

require('dotenv').config();

// Inicializar express
const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS middleware - before any routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://equipo1-ecommerce-nuevo.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Body parser middleware
app.use(express.json());

// Database connection check middleware
const checkDatabaseConnection = async (req, res, next) => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('[Database] Connection check failed');
      return res.status(503).json({
        error: 'Database connection not available',
        timestamp: new Date().toISOString()
      });
    }
    next();
  } catch (error) {
    console.error('[Database] Error:', error);
    return res.status(503).json({
      error: 'Database error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.status(200).json({
      status: isConnected ? 'OK' : 'Error',
      timestamp: new Date().toISOString(),
      database: isConnected ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    console.error('[Health] Check failed:', error);
    res.status(500).json({
      status: 'Error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas CRUD
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/email', emailRoutes);

// Ruta inicial
app.get('/', (req, res) => res.send('Servidor corriendo...'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server] Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
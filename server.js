/* const express = require('express');
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

// Detailed logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Simplified CORS configuration
app.use(cors());

// Body parser middleware
app.use(express.json());

// Basic health check that doesn't depend on DB
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Database health check
app.get('/api/db-health', async (req, res) => {
  try {
    await dbConnection.authenticate();
    res.json({
      status: 'OK',
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Database connection failed',
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
  console.error('Error:', err);
  res.status(500).json({
    status: 'Error',
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
 */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Detailed logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration
app.use(cors({
  origin: ['https://equipo1-ecommerce-nuevo.vercel.app'],
  methods: ['GET', 'POST', 'PUT', DELETE, 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Create database pool
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check endpoint with detailed diagnostics
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      environment: process.env.NODE_ENV,
      cors: {
        origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
        enabled: true
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        code: error.code
      }
    });
  }
});

// Products endpoint with error handling
app.get('/api/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [products] = await connection.query('SELECT * FROM products');
      res.json({
        status: 'success',
        data: products
      });
    } catch (error) {
      console.error('Query error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Database query failed',
        error: error.message
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = app;


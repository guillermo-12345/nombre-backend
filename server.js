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
const { ProductModel } = require('./models');
require('dotenv').config();

const app = express();

// Enhanced logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration - must be before routes
app.use((req, res, next) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://equipo1-ecommerce-nuevo.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Products endpoint with proper error handling
app.get('/api/products', async (req, res) => {
  try {
    console.log('[Products] Attempting to fetch products');
    
    const products = await ProductModel.findAll({
      attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'img']
    });

    console.log(`[Products] Successfully fetched ${products.length} products`);
    
    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('[Products] Error fetching products:', {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = app;


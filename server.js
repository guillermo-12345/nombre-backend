const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
require('dotenv').config();

const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.get('origin'));
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration
const corsOptions = {
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Pre-flight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoute');
const clientRoutes = require('./routes/clientRoutes');
const emailRoutes = require('./routes/emailRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const profileRoutes = require('./routes/profileRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

// Database connection check middleware
const checkDbConnection = async (req, res, next) => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('[Database] Connection check failed');
      return res.status(503).json({
        error: 'Database connection not available',
        timestamp: new Date().toISOString()
      });
    }
    console.log('[Database] Connection check passed');
    next();
  } catch (error) {
    console.error('[Database] Error during connection check:', error);
    return res.status(503).json({
      error: 'Database error',
      message: error.message
    });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }
  });
});

// Apply routes with database check
app.use('/api/auth', checkDbConnection, authRoutes);
app.use('/api/clients', checkDbConnection, clientRoutes);
app.use('/api/email', checkDbConnection, emailRoutes);
app.use('/api/orders', checkDbConnection, orderRoutes);
app.use('/api/products', checkDbConnection, productRoutes);
app.use('/api/profile', checkDbConnection, profileRoutes);
app.use('/api/protected', checkDbConnection, protectedRoutes);
app.use('/api/purchases', checkDbConnection, purchasesRoutes);
app.use('/api/suppliers', checkDbConnection, supplierRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server] Error:', {
    message: err.message,
    stack: err.stack
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Catch-all route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;


const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const authRoutes = require('./routes/authRoute');
const clientRoutes = require('./routes/clientRoutes');
const emailRoutes = require('./routes/emailRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

const app = express();

// Enhanced logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration
app.use(cors({
  origin: ['https://equipo1-ecommerce-nuevo.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection check middleware
const checkDbConnection = async (req, res, next) => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
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

// Database health check
app.get('/api/db-health', checkDbConnection, (req, res) => {
  res.json({
    status: 'OK',
    message: 'Database connection successful',
    timestamp: new Date().toISOString()
  });
});

// Routes with database check
app.use('/api/products', checkDbConnection, productRoutes);
app.use('/api/auth', checkDbConnection, authRoutes);
app.use('/api/clients', checkDbConnection, clientRoutes);
app.use('/api/email', checkDbConnection, emailRoutes);
app.use('/api/orders', checkDbConnection, orderRoutes);
app.use('/api/profile', checkDbConnection, profileRoutes);
app.use('/api/protected', checkDbConnection, protectedRoutes);
app.use('/api/purchases', checkDbConnection, purchasesRoutes);
app.use('/api/suppliers', checkDbConnection, supplierRoutes);

// Apply CORS to all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://equipo1-ecommerce-nuevo.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


// Catch-all route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Server] Error:', {
    message: err.message,
    stack: err.stack
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = app;


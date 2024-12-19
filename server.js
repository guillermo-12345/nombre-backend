const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
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
app.use(cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Additional CORS headers for preflight requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://equipo1-ecommerce-nuevo.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

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

// Apply routes with database check
app.use('/api/products', checkDbConnection, productRoutes);

// Catch-all route for undefined routes
app.use('*', (req, res) => {
  console.log(`[404] Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

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

module.exports = app;


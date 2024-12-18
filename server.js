const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/db');
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
  origin: ['https://equipo1-ecommerce-nuevo.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Database initialization middleware
const initDb = async (req, res, next) => {
  if (!app.locals.dbInitialized) {
    try {
      const isInitialized = await initializeDatabase();
      if (!isInitialized) {
        throw new Error('Database initialization failed');
      }
      app.locals.dbInitialized = true;
    } catch (error) {
      console.error('[Server] Database initialization error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database initialization failed',
        message: error.message
      });
    }
  }
  next();
};

// Apply database initialization middleware to all routes
app.use(initDb);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
    },
    dbInitialized: app.locals.dbInitialized
  });
});

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/suppliers', supplierRoutes);

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


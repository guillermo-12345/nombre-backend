const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/db');
require('dotenv').config();

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.get('origin'));
  next();
});

// CORS configuration
const allowedOrigins = ['https://equipo1-ecommerce-nuevo.vercel.app', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization middleware
const initDb = async (req, res, next) => {
  if (!app.locals.dbInitialized) {
    try {
      await initializeDatabase();
      app.locals.dbInitialized = true;
    } catch (error) {
      console.error('[Database Initialization Error]:', error.message);
      return res.status(500).json({ success: false, error: 'Database initialization failed' });
    }
  }
  next();
};
app.use(initDb);

// Routes
const routes = [
  { path: '/api/auth', route: require('./routes/authRoute') },
  { path: '/api/clients', route: require('./routes/clientRoutes') },
  { path: '/api/products', route: require('./routes/productRoutes') }
  // Agrega el resto de rutas
];

routes.forEach(r => app.use(r.path, r.route));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` });
});

module.exports = app;

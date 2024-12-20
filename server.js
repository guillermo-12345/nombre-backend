const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();

// Configuración global de CORS
app.use(cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para procesar JSON
app.use(express.json());

// Verificar conexión a la base de datos
const checkDbConnection = async (req, res, next) => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return res.status(503).json({
        error: 'Database connection not available',
        timestamp: new Date().toISOString(),
      });
    }
    next();
  } catch (error) {
    console.error('[Database] Error:', error.message);
    return res.status(503).json({
      error: 'Database error',
      message: error.message,
    });
  }
};

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de productos con verificación de base de datos
app.use('/api/products', checkDbConnection, productRoutes);

// Middleware para manejar rutas no definidas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error('[Server Error]:', {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

module.exports = app;



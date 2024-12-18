const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS middleware (aplicado globalmente)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://equipo1-ecommerce-nuevo.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de ejemplo
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Health check passed' });
});

// Ruta principal de productos
app.get('/api/products', (req, res) => {
  res.status(200).json({
    success: true,
    products: [
      { id: 1, name: 'Producto 1', price: 100 },
      { id: 2, name: 'Producto 2', price: 200 }
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, error: err.message });
});

// Exportar servidor
module.exports = app;

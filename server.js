const express = require('express');
const app = express();

// Forzar CORS de forma global
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://equipo1-ecommerce-nuevo.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Ruta de prueba
app.get('/api/products', (req, res) => {
  res.json({ success: true, products: [{ id: 1, name: 'Producto de prueba', price: 100 }] });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ success: false, error: err.message });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

module.exports = app;

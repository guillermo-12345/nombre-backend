const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para ver productos - disponible para cualquier usuario autenticado
router.get('/products', authenticateToken, (req, res) => {
  // Lógica para obtener productos (para usuarios autenticados)
  res.send('Listado de productos disponibles para la compra');
});

// Ruta para agregar producto - solo para administradores
router.post('/products', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  // Lógica para agregar un producto
  res.send(`Producto agregado por ${req.user.email}`);
});

// Ruta para reportes - solo para administradores
router.get('/admin/reports', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  // Lógica para mostrar reportes
  res.send('Reporte administrativo');
});

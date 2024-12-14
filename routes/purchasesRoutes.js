// routes/purchases.js
const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// Crear una nueva compra
router.post('/', orderController.createPurchase);

// Obtener todas las compras
router.get('/', orderController.getAllPurchases);


module.exports = router;

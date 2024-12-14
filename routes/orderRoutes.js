const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Ruta para obtener todas las órdenes
router.get('/', orderController.getOrders);

// Ruta para obtener una orden específica por ID
router.get('/:id', orderController.getOrderById);

// Ruta para crear una nueva orden
router.post('/', orderController.createOrder);

// Ruta para actualizar una orden por ID
router.put('/:id', orderController.updateOrder);

// Ruta para eliminar una orden por ID
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
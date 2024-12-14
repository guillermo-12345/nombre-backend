const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para obtener productos por categoría y proveedor
router.get('/by-category-and-supplier', productController.getProductsByCategoryAndSupplier);

// Ruta para obtener productos por categoría
router.get('/by-category', productController.getProductsByCategory);

// Rutas para el CRUD de productos
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;


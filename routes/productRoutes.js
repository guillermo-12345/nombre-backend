const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { dbConnection } = require('../config/db');

router.get('/', productController.getAllProducts);
router.get('/by-category-and-supplier', productController.getProductsByCategoryAndSupplier);
router.get('/by-category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

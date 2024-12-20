const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const { dbConnection } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [results] = await dbConnection.query('SELECT * FROM products');
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('[Products] Error fetching products:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get products by category and supplier
router.get('/by-category-and-supplier', productController.getProductsByCategoryAndSupplier);

// Get products by category
router.get('/by-category', productController.getProductsByCategory);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/', productController.createProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;


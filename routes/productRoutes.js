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

router.get('/by-category-and-supplier', productController.getProductsByCategoryAndSupplier);
router.get('/by-category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

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

// controllers/productController.js
const { dbConnection } = require('../config/db');
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await dbConnection.query('SELECT * FROM products');
    if (!products.length) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('[ProductController] Error in getAllProducts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('[ProductController] Error in getProductById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('[ProductController] Error in createProduct:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      await product.update(req.body);
      res.status(200).json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('[ProductController] Error in updateProduct:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.status(200).json({ success: true, message: 'Product deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('[ProductController] Error in deleteProduct:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

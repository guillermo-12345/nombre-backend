const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  try {
    console.log('[ProductController] Starting getAllProducts request');
    
    const products = await Product.findAll({
      attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'img']
    });

    console.log(`[ProductController] Found ${products.length} products`);
    
    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('[ProductController] Error in getAllProducts:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
  }
};



exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ProductController] Getting product with ID: ${id}`);

    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('[ProductController] Error in getProductById:', error);
    return res.status(500).json({
      success: false,
      error: 'Error fetching product',
      message: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log('[ProductController] Creating new product');
    const product = await Product.create(req.body);
    console.log(`[ProductController] Product created with ID: ${product.id}`);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('[ProductController] Error in createProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating product',
      message: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ProductController] Updating product with ID: ${id}`);
    const product = await Product.findByPk(id);
    if (product) {
      await product.update(req.body);
      console.log(`[ProductController] Product updated: ${id}`);
      res.json({
        success: true,
        data: product
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
  } catch (error) {
    console.error('[ProductController] Error in updateProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating product',
      message: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[ProductController] Deleting product with ID: ${id}`);
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      console.log(`[ProductController] Product deleted: ${id}`);
      res.json({
        success: true,
        message: 'Product deleted'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
  } catch (error) {
    console.error('[ProductController] Error in deleteProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting product',
      message: error.message
    });
  }
};

exports.getProductsByCategoryAndSupplier = async (req, res) => {
  const { category, supplierId } = req.query;
  console.log(`[ProductController] Fetching products by category: ${category} and supplier: ${supplierId}`);

  try {
    const products = await Product.findAll({
      where: {
        category: category,
        supplierId: supplierId
      }
    });

    console.log(`[ProductController] Found ${products.length} products`);
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('[ProductController] Error in getProductsByCategoryAndSupplier:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching products by category and supplier',
      message: error.message
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  console.log(`[ProductController] Fetching products by category: ${category}`);

  try {
    const products = await Product.findAll({ where: { category } });
    console.log(`[ProductController] Found ${products.length} products in category ${category}`);
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('[ProductController] Error in getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching products by category',
      message: error.message
    });
  }
};


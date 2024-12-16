const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  console.log('[ProductController] Starting getAllProducts request');
  
  try {
    // Detailed connection test
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('[ProductController] Database connection test failed');
      return res.status(503).json({
        success: false,
        error: 'Database connection unavailable',
        timestamp: new Date().toISOString()
      });
    }

    // Test raw query first
    try {
      await dbConnection.query('SELECT NOW()');
      console.log('[ProductController] Raw query test successful');
    } catch (error) {
      console.error('[ProductController] Raw query test failed:', error);
      throw new Error('Database query test failed');
    }

    // Verify Product model is properly initialized
    if (!Product || !Product.findAll) {
      console.error('[ProductController] Product model is not properly initialized');
      throw new Error('Product model initialization error');
    }

    console.log('[ProductController] Attempting to fetch products');
    const products = await Product.findAll({
      attributes: [
        'id', 
        'title', 
        'description', 
        'price', 
        'category',
        'stock',
        'img'
      ],
      logging: (sql) => console.log('[ProductController] Executing SQL:', sql)
    });

    console.log(`[ProductController] Successfully fetched ${products.length} products`);
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[ProductController] Error in getAllProducts:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });

    // Send a more detailed error response
    return res.status(500).json({
      success: false,
      error: 'Error fetching products from database',
      details: error.message,
      timestamp: new Date().toISOString(),
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Getting product with ID: ${id}`);

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
    console.error('Error in getProductById:', error);
    return res.status(500).json({
      success: false,
      error: 'Error fetching product',
      message: error.message
    });
  }
};



// Crear un producto
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};


// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Obtener productos por categoría y proveedor
exports.getProductsByCategoryAndSupplier = async (req, res) => {
  const { category, supplierId } = req.query;

  try {
    // Buscar productos que coincidan con la categoría y el proveedor
    const products = await Product.findAll({
      where: {
        category: category,
        supplierId: supplierId
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


exports.getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    const products = await Product.findAll({ where: { category } });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
};


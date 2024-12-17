const Product = require('../models/Product');
const { Op } = require('sequelize');
exports.getAllProducts = async (req, res) => {
  try {
    console.log('[ProductController] Starting getAllProducts');
    
    if (!ProductModel || !ProductModel.findAll) {
      console.error('[ProductController] Product model not properly initialized');
      return res.status(500).json({
        success: false,
        error: 'Database configuration error',
        timestamp: new Date().toISOString()
      });
    }

    console.log('[ProductController] Executing findAll query');
    
    const products = await ProductModel.findAll({
      attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'img'],
      raw: true
    });

    console.log(`[ProductController] Found ${products.length} products`);
    
    return res.status(200).json({
      success: true,
      data: products,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[ProductController] Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message,
      timestamp: new Date().toISOString()
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


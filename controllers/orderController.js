
// Crear una nueva orden en el controlador
/* exports.createOrder = async (req, res) => {
  const { items, total, type, buyer_info } = req.body;

  try {
    // Crear la orden principal
    const order = await Order.create({
      buyer_info,
      total,
      type,
      date: new Date().toISOString(),
    });

    // Crear las asociaciones para cada ítem de la orden
    for (const item of items) {
      const product = await Product.findByPk(item.id);
      if (!product) {
        return res.status(404).json({ error: `Producto con ID ${item.id} no encontrado` });
      }
      await OrderItem.create({
        order_id: order.id,  // Asegúrate de incluir el ID de la orden aquí
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
        product_name: product.title  // Asegúrate de incluir el nombre del producto aquí
      });   
      
      // Actualizar stock si es una venta
      if (type === 'venta') {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json({ id: order.id });
  } catch (error) {
    console.error('Error creando la orden:', error);
    res.status(500).json({ error: 'Error creando la orden' });
  }
}; */


// Obtener una orden por ID
/* exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id, {
      include: {
        model: OrderItem,
        include: {
          model: Product,
          attributes: ['title', 'category'],
        },
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error obteniendo la orden:', error);
    res.status(500).json({ error: 'Error obteniendo la orden' });
  }
};
exports.createOrder = async (req, res) => {
  const { items, total, type, buyer_info } = req.body;

  try {
    // Crear la orden principal
    const order = await Order.create({
      buyer_info,
      total,
      type,
      date: new Date(),
    });

    // Crear las asociaciones para cada ítem de la orden
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Producto con ID ${item.product_id} no encontrado` });
      }
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: product.price,
      });

      // Actualizar stock si es una venta
      if (type === 'venta') {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json({ id: order.id });
  } catch (error) {
    console.error('Error creando la orden:', error);
    res.status(500).json({ error: 'Error creando la orden' });
  }
}; */

/* 



*/

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.getOrders = async (req, res) => {
  try {
    const { type } = req.query;
    const orders = await Order.findAll({
      where: { type: 'venta'  },
      include: {
        model: OrderItem,
        as: 'items',
        include: {
          model: Product,
          as: 'product',
          attributes: ['title', 'category'],
        },
      },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error obteniendo las órdenes:', error);
    res.status(500).json({ error: 'Error obteniendo las órdenes' });
  }
};


 
// Obtener una orden específica
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: {
        model: OrderItem,
        as: 'items',
        include: {
          model: Product,
          as: 'product',
          attributes: ['title', 'category'],
        },
      },
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Orden no encontrada' });
    }
  } catch (error) {
    console.error('Error obteniendo la orden:', error);
    res.status(500).json({ error: 'Error obteniendo la orden' });
  }
};


// Crear una nueva orden
exports.createOrder = async (req, res) => {
  const { items, total, type, buyer_info } = req.body;

  try {
    // Crear la orden principal
    const order = await Order.create({
      buyer_info,
      total,
      type,
      date: new Date().toISOString(),
    });

    // Crear las asociaciones para cada ítem de la orden
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Producto con ID ${item.product_id} no encontrado` });
      }
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        product_name: product.title,
        quantity: item.quantity,
        price: product.price,
      });

      // Actualizar stock si es una venta
      if (type === 'venta') {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json({ id: order.id });
  } catch (error) {
    console.error('Error creando la orden:', error);
    res.status(500).json({ error: 'Error creando la orden' });
  }
};

// Actualizar una orden
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.update(req.body);
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Orden no encontrada' });
    }
  } catch (error) {
    console.error("Error actualizando la orden:", error);
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
};

// Eliminar una orden
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.destroy();
      res.status(200).json({ message: 'Orden eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Orden no encontrada' });
    }
  } catch (error) {
    console.error("Error eliminando la orden:", error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
};

// Crear una nueva compra
exports.createPurchase = async (req, res) => {
  try {
    const { supplierId, productId, quantity, price, total, type, buyer_info } = req.body;

    // Validaciones básicas
    if (!supplierId || !productId || !quantity || !price || !total || !type || !buyer_info) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (isNaN(total) || total <= 0) {
      return res.status(400).json({ error: 'El total debe ser un número válido' });
    }

    // Parsear buyer_info si es un string
    const parsedBuyerInfo = typeof buyer_info === 'string' ? JSON.parse(buyer_info) : buyer_info;

    // Crear la orden principal
    const order = await Order.create({
      buyer_info: parsedBuyerInfo,
      total,
      type: "compra",
      date: new Date(),
    });

    // Crear el ítem de la orden
    const orderItem = await OrderItem.create({
      order_id: order.id,
      product_id: productId,
      product_name: parsedBuyerInfo.productName,
      quantity,
      price,
    });

    // Incrementar el stock del producto
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
    }

    product.stock += quantity; 
    await product.save(); 
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error al crear la compra:', error);
    res.status(500).json({ error: 'Error al registrar la compra' });
  }
};


// Obtener todas las compras
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Order.findAll({
      where: { type: 'compra' },
      include: {
        model: OrderItem,
        as: 'items',
        include: {
          model: Product,
          as: 'product',
          attributes: ['title', 'category'],
        },
      },
    });
    res.json(purchases);
  } catch (error) {
    console.error('Error obteniendo las compras:', error);
    res.status(500).json({ error: 'Error obteniendo las compras' });
  }
};
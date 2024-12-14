const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Obtener todos los clientes
router.get('/', clientController.getClients);

// Obtener un cliente por ID
router.get('/:id', clientController.getClientById);

// Crear un nuevo cliente
router.post('/', clientController.createClient);

// Actualizar un cliente existente
router.put('/:id', clientController.updateClient);

// Eliminar un cliente
router.delete('/:id', clientController.deleteClient);
// Obtener cliente por email
router.get('/email/:email', clientController.getClientByEmail);

module.exports = router;
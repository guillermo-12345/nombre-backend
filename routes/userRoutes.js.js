const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { validarCampos } = require('../middlewares/validadorCampos');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken');

// Crear Cliente
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  userController.createClient
);

// Obtener Clientes
router.get('/', verifyFirebaseToken, userController.getClients);

// Enviar correos electrónicos a los clientes
router.post('/send-emails', userController.sendEmailToClients);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

// Ruta para obtener el rol del usuario
router.get('/user', authenticateToken, authController.getUserRole);

// Ruta para verificar el rol del usuario después de iniciar sesión
router.post('/verifyRole', authenticateToken, authController.verifyUserRole);

// Nueva ruta para logout
router.post('/logout', authenticateToken, (req, res, next) => {
    console.log('Logout route reached');
    next();
  }, authController.logout);
  

module.exports = router;

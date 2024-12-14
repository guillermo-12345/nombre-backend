const admin = require('../admin/admin');
const adminEmails = ["guillermo.ibanezc@gmail.com", "trek0.88@gmail.com"];

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decodedToken.uid);
    
    req.user = {
      email: user.email,
      isAdmin: adminEmails.includes(user.email),
    };

    next();
  } catch (error) {
    console.error('Error al autenticar el token:', error);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authenticateToken;

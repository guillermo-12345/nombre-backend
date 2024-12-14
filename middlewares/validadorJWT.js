const admin = require('../admin/admin');

const validarJWT = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ ok: false, msg: 'No hay token en la petición' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;
    next();
  } catch (error) {
    console.error('Error al validar token:', error);
    return res.status(401).json({ ok: false, msg: 'Token no válido' });
  }
};

module.exports = validarJWT;

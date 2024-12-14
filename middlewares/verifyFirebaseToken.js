/* const admin = require('firebase-admin');
const serviceAccount = require('../credentials/firebase-key.json');
const userController = require('../controllers/userController');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.header("authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó un token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email; 
    await userController.registerUserIfNotExists(req, res, next); 
  } catch (error) {
    console.error("Token no válido:", error);
    res.status(401).json({ message: "Token no válido" });
  }
};

module.exports = verifyFirebaseToken; */
const admin = require('../admin/admin');
const userController = require('../controllers/userController'); 

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó un token" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;

    // Registrar al usuario si no existe en la base de datos
    await userController.registerUserIfNotExists(req, res, next);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(401).json({ message: "Token no válido" });
  }
};

module.exports = verifyFirebaseToken;

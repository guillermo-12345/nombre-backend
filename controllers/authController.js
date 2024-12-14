const admin = require('../admin/admin');
const adminEmails = ["guillermo.ibanezc@gmail.com", "trek0.88@gmail.com"];

exports.getUserRole = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    res.json({ role: user.isAdmin ? 'admin' : 'user' });
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error);
    res.status(500).json({ error: 'Error al obtener el rol del usuario' });
  }
};

exports.verifyUserRole = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const userRole = user.isAdmin ? 'admin' : 'user';
    console.log(`Usuario autenticado: ${user.email}, Rol: ${userRole}`);

    res.json({ userRole });
  } catch (error) {
    console.error('Error al verificar el rol del usuario:', error);
    res.status(500).json({ error: 'Error al verificar el rol del usuario' });
  }
};

exports.logout = (req, res) => {
  try {

    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

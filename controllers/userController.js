const User = require('../models/Client');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../../src/components/helpers/generadorJWT');

// Crear Usuario (si se quiere crear un cliente manualmente)
exports.createClient = async (req, res) => {
  const { name, email, password, esAdmin = false } = req.body;

  try {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const clientData = {
      name,
      email,
      password: hashedPassword,
      esAdmin,
      fechaRegistro: new Date(),
    };

    const newClient = await User.create(clientData);
    const token = await generarJWT(newClient.id, name);

    res.json({
      ok: true,
      usuario: { id: newClient.id, name, email, esAdmin },
      token,
    });
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error creando cliente',
    });
  }
};

// Obtener todos los Usuarios (Clientes)
exports.getClientes = async (req, res) => {
  try {
    const clientes = await User.findAll();
    res.json({
      ok: true,
      clientes,
    });
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error obteniendo clientes',
    });
  }
};

// Enviar correos a los usuarios
exports.sendEmailToUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const user of users) {
      let message = `
        Hola ${user.name},

        ¡Esperamos que estés disfrutando de los productos en nuestra tienda!

        Recuerda que siempre puedes acceder a nuestra tienda y revisar nuestras novedades.
      `;

      if (!user.cuit) {
        message += `\nNota: No hemos encontrado tu CUIT registrado. Por favor, completa tu perfil para poder ofrecerte una mejor experiencia.`;
      } else {
        message += `\nEnlace a tu perfil para actualizar información: ${process.env.CLIENT_URL}/profile/${user.id}`;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Completa tu perfil en nuestra tienda',
        text: message,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).send('Correos enviados correctamente');
  } catch (error) {
    console.error('Error enviando correos:', error);
    res.status(500).send('Error enviando correos a los usuarios');
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error('Error obteniendo los usuarios:', error);
    throw new Error('Error obteniendo los usuarios');
  }
};


const db = require('../models'); // Cambia esto según tu configuración de Sequelize

const registerUserIfNotExists = async (req, res, next) => {
  const { uid, email } = req;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const user = await db.User.findOne({ where: { uid } });
    if (!user) {
      // Si no existe, lo creamos
      await db.User.create({ uid, email });
    }

    next(); // Continuar con el siguiente middleware o controlador
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno al verificar usuario" });
  }
};

module.exports = { registerUserIfNotExists };

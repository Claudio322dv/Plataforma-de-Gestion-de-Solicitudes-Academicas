
const { autenticarUsuario } = require('../services/auth.service');

// Depende del modelo que implementará el integrante 3
const User = require('../models/User');

async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios'
      });
    }

    const usuario = await User.findOne({
      email: email.trim().toLowerCase()
    }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    const token = await autenticarUsuario(
      usuario,
      password
    );

    if (!token) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      tokenType: 'Bearer',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
}

module.exports = { login };

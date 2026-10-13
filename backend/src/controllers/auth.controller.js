
const User = require('../models/User');
const { autenticarUsuario } = require('../services/auth.service');
const { verificarToken } = require('../services/jwt.service');

// Inicio de sesion
async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios'
      });
    }

    const correo = email.trim().toLowerCase();

    const usuario = await User.findOne({
      email: correo
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
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
}

// Comprobar firma y expiracion del JWT
function verificarSesion(req, res) {
  const autorizacion = req.headers.authorization || '';
  const coincidencia = /^Bearer\s+(\S+)$/i.exec(autorizacion);

  if (!coincidencia) {
    return res.status(401).json({
      mensaje: 'Token no proporcionado'
    });
  }

  try {
    const datos = verificarToken(coincidencia[1]);

    return res.status(200).json({
      valido: true,
      usuario: {
        id: datos.sub,
        role: datos.role
      },
      exp: datos.exp
    });

  } catch (error) {
    return res.status(401).json({
      mensaje: error.name === 'TokenExpiredError'
        ? 'Token expirado'
        : 'Token inválido'
    });
  }
}

module.exports = {
  login,
  verificarSesion
};

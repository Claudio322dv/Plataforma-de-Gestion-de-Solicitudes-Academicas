
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');

const conectarDB = require('../src/database');
const User = require('../src/models/User');

async function crearUsuarioDemo() {
  try {
    await conectarDB();

    const email = 'demo.login@example.test';

    // Contraseña temporal aleatoria
    const password = crypto
      .randomBytes(12)
      .toString('base64url');

    // Generar hash con bcrypt
    const hash = await bcrypt.hash(password, 12);

    const existente = await User.findOne({ email })
      .select('+password');

    if (existente) {
      // Renovar credenciales del usuario de prueba
      existente.password = hash;
      await existente.save();
    } else {
      await User.create({
        nombre: 'Usuario de prueba',
        email,
        password: hash,
        role: 'usuario'
      });
    }

    console.log('Usuario de prueba preparado');
    console.log('Correo:', email);
    console.log('Contraseña temporal:', password);
    console.log('Usar únicamente en desarrollo');

  } catch (error) {
    console.error('Error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

crearUsuarioDemo();


const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave exclusiva de pruebas
process.env.JWT_SECRET =
  'clave-de-pruebas-solo-para-tests-1234567890';

process.env.JWT_EXPIRES_IN = '1h';

const {
  generarToken,
  verificarToken
} = require('../src/services/jwt.service');

const {
  autenticarUsuario
} = require('../src/services/auth.service');

test('JWT válido y expiración de una hora', () => {
  const token = generarToken({
    _id: '123',
    role: 'usuario'
  });

  const datos = verificarToken(token);

  assert.equal(datos.sub, '123');
  assert.equal(datos.role, 'usuario');
  assert.equal(datos.exp - datos.iat, 3600);
});

test('Rechazar JWT modificado', () => {
  const token = generarToken({
    _id: '123',
    role: 'usuario'
  });

  const [header, , signature] = token.split('.');

  const payloadModificado = Buffer.from(
    JSON.stringify({
      sub: '123',
      role: 'admin'
    })
  ).toString('base64url');

  const manipulado =
    `${header}.${payloadModificado}.${signature}`;

  assert.throws(() => verificarToken(manipulado));
});

test('Rechazar JWT expirado', () => {
  const token = jwt.sign(
    { role: 'usuario' },
    process.env.JWT_SECRET,
    {
      subject: '123',
      expiresIn: -1,
      algorithm: 'HS256'
    }
  );

  assert.throws(
    () => verificarToken(token),
    { name: 'TokenExpiredError' }
  );
});

test('bcrypt acepta contraseña correcta', async () => {
  const password = 'ClavePrueba123!';

  const hash = await bcrypt.hash(password, 4);

  const usuario = {
    _id: '123',
    role: 'usuario',
    password: hash
  };

  const token = await autenticarUsuario(
    usuario,
    password
  );

  assert.equal(typeof token, 'string');
});

test('bcrypt rechaza contraseña incorrecta', async () => {
  const hash = await bcrypt.hash('Correcta123!', 4);

  const usuario = {
    _id: '123',
    role: 'usuario',
    password: hash
  };

  const resultado = await autenticarUsuario(
    usuario,
    'Incorrecta123!'
  );

  assert.equal(resultado, null);
});

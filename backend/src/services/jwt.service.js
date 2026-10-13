
	const jwt = require('jsonwebtoken');

	// Obtener la clave secreta del entorno
	function obtenerClaveSecreta() {
	const clave = process.env.JWT_SECRET;

	if (!clave || clave.length < 32) {
		throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
	}

	return clave;
	}

	// Generar un token cuando el usuario inicia sesión
	function generarToken(usuario) {
	const id = usuario?._id ?? usuario?.id;

	if (!id) {
		throw new Error('El usuario debe tener un ID');
	}

	return jwt.sign(
		{
		role: usuario.role || 'usuario'
		},
		obtenerClaveSecreta(),
		{
		subject: String(id),
		expiresIn: process.env.JWT_EXPIRES_IN || '1h',
		algorithm: 'HS256'
		}
	);
	}

	// Verificar la autenticidad y expiración del token
	function verificarToken(token) {
	return jwt.verify(token, obtenerClaveSecreta(), {
		algorithms: ['HS256']
	});
	}

module.exports = {
  generarToken,
  verificarToken
};

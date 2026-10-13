
	const bcrypt = require('bcryptjs');
	const { generarToken } = require('./jwt.service');

	// Verificar contraseña y generar JWT
	async function autenticarUsuario(usuario, passwordIngresada) {

	// Comprobar que existan los datos necesarios
	if (
		!usuario ||
		typeof usuario.password !== 'string' ||
		typeof passwordIngresada !== 'string'
	) {
		return null;
	}

	// Comparar contraseña con el hash almacenado
	const passwordCorrecta = await bcrypt.compare(
		passwordIngresada,
		usuario.password
	);

	if (!passwordCorrecta) {
		return null;
	}

	// Si la contraseña es correcta, generar JWT
	const token = generarToken(usuario);

	return token;
	}

	module.exports = {
	autenticarUsuario
	};

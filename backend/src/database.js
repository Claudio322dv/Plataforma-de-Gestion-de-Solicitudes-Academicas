
const mongoose = require('mongoose');

async function conectarDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/solicitudes_academicas');

        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = conectarDB;

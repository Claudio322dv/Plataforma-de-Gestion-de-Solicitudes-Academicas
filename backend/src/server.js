
const express = require('express');
const conectarDB = require('./database');
const solicitudesRoutes = require('./routes/solicitudes.routes');

const app = express();
const PORT = 3000;

// Middleware para interpretar solicitudes JSON
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Gestion de Solicitudes Academicas',
        estado: 'OK'
    });
});

// Rutas del CRUD de solicitudes
app.use('/api/solicitudes', solicitudesRoutes);

// Middleware para rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
});

// Conectar a MongoDB e iniciar el servidor
async function iniciarServidor() {
    await conectarDB();

    app.listen(PORT, () => {
        console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    });
}

iniciarServidor();

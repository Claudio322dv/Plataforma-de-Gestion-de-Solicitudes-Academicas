const express = require('express');
const router = express.Router();
const Solicitud = require('../models/Solicitud');

// GET: consultar todas las solicitudes
router.get('/', async (req, res) => {
    try {
        const solicitudes = await Solicitud.find();
        res.json(solicitudes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar solicitudes' });
    }
});

// GET: consultar una solicitud por ID
router.get('/:id', async (req, res) => {
    try {
        const solicitud = await Solicitud.findById(req.params.id);

        if (!solicitud) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }

        res.json(solicitud);
    } catch (error) {
        res.status(400).json({ mensaje: 'ID de solicitud no valido' });
    }
});

// POST: crear una solicitud
router.post('/', async (req, res) => {
    try {
        const { estudiante, curso, descripcion } = req.body;

        if (!estudiante || !curso || !descripcion) {
            return res.status(400).json({
                mensaje: 'Estudiante, curso y descripcion son obligatorios'
            });
        }

        const nuevaSolicitud = await Solicitud.create({
            estudiante,
            curso,
            descripcion
        });

        res.status(201).json(nuevaSolicitud);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear la solicitud' });
    }
});

// PUT: actualizar una solicitud
router.put('/:id', async (req, res) => {
    try {
        const { estudiante, curso, descripcion, estado } = req.body;

        if (!estudiante || !curso || !descripcion || !estado) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios para actualizar'
            });
        }

        const solicitud = await Solicitud.findByIdAndUpdate(
            req.params.id,
            { estudiante, curso, descripcion, estado },
            { new: true, runValidators: true }
        );

        if (!solicitud) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }

        res.json(solicitud);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            mensaje: 'No se pudo actualizar la solicitud. Verifica el ID y los datos.'
        });
    }
});

// DELETE: eliminar una solicitud
router.delete('/:id', async (req, res) => {
    try {
        const solicitud = await Solicitud.findByIdAndDelete(req.params.id);

        if (!solicitud) {
            return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
        }

        res.json({ mensaje: 'Solicitud eliminada correctamente' });
    } catch (error) {
        res.status(400).json({ mensaje: 'ID de solicitud no valido' });
    }
});

module.exports = router;

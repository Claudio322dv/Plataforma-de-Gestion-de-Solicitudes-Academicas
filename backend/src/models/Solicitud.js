
const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
    estudiante: {
        type: String,
        required: true,
        trim: true
    },
    curso: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'En revision', 'Aprobada', 'Rechazada'],
        default: 'Pendiente'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Solicitud', solicitudSchema);

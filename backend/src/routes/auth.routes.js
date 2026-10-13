const express = require('express');

const {
  login,
  verificarSesion
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', login);

router.get('/verificar', verificarSesion);

module.exports = router;

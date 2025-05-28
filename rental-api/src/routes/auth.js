// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Importe o middleware

// POST /api/auth/register - Registrar novo usuário
router.post('/register', authController.registerUser);

// POST /api/auth/login - Login do usuário
router.post('/login', authController.loginUser);

// GET /api/auth/me - Obter dados do usuário logado (requer token)
router.get('/me', authMiddleware, (req, res) => {
    // O authMiddleware já validou o token e anexou req.user
    // Se chegamos aqui, o token é válido.
    // Apenas retornamos os dados do usuário que o middleware extraiu do token.
    // Você pode buscar dados mais atualizados do banco se preferir, mas para este caso, req.user é suficiente.
    res.json(req.user); 
});

module.exports = router;
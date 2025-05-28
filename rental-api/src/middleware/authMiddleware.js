// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Pegar token do header
    const authHeader = req.header('Authorization');
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_mvp';

    // Checar se não há token
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Formato do token "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ msg: 'Token format is "Bearer <token>"' });
    }
    const token = parts[1];

    // Verificar token
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user; // Adiciona o payload do usuário ao objeto req
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
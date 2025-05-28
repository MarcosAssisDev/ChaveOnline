// src/routes/reservations.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// GET /api/reservations - Listar todas as reservas
router.get('/', reservationController.listReservations);

// POST /api/reservations - Criar uma nova reserva
router.post('/', reservationController.createReservation);

// GET /api/reservations/search - Buscar reservas por data e cidade
router.get('/search', reservationController.searchReservations);

module.exports = router;
const express = require('express');
const router = express.Router();
const metricController = require('../controllers/metricController.js');

// GET /api/metrics/channel-summary - Total de reservas e faturamento por canal no último mês
router.get('/channel-summary', metricController.getChannelSummary);

// GET /api/metrics/top-cities - Lista de cidades com mais reservas
router.get('/top-cities', metricController.getTopCities);

module.exports = router;
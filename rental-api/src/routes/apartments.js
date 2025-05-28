// src/routes/apartments.js
const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartmentController');

// GET /api/apartments - Listar todos os apartamentos
router.get('/', apartmentController.listApartments);

module.exports = router;
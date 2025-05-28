// src/routes/contacts.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET /api/contacts - Listar todos os contatos
router.get('/', contactController.listContacts);

module.exports = router;
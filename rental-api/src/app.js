require('dotenv').config(); // Carrega variáveis do .env
const express = require('express');
const cors = require('cors');
const path = require('path'); // Para servir arquivos estáticos do frontend depois

const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const metricRoutes = require('./routes/metrics');
const apartmentRoutes = require('./routes/apartments'); // Nova importação
const contactRoutes = require('./routes/contacts');   // Nova importação
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Rotas públicas (não precisam de token)
app.use('/api/auth', authRoutes);
// Rotas protegidas
// Todas as rotas abaixo desta linha precisarão de um token JWT válido
app.use('/api/reservations', authMiddleware, reservationRoutes);
app.use('/api/metrics', authMiddleware, metricRoutes);
app.use('/api/apartments', authMiddleware, apartmentRoutes); 
app.use('/api/contacts', authMiddleware, contactRoutes);

app.get('/', (req, res) => {
    res.send('Rental Management API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

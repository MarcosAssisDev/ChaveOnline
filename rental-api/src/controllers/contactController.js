// src/controllers/contactController.js
const db = require('../services/db');

// Helper function (reutilize ou importe)
function allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// [GET] Listar todos os contatos
exports.listContacts = async (req, res) => {
    // Para um dropdown, geralmente ID e Nome são suficientes.
    // Incluí email e type para referência, mas podem ser removidos se não usados no frontend.
    const sql = `
        SELECT
            id,
            name,
            email,
            type,
            phone, 
            document 
        FROM contacts
        ORDER BY name;
    `;
    try {
        const contacts = await allAsync(sql);
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to retrieve contacts' });
    }
};

// Futuramente, você pode adicionar aqui:
// exports.createContact = async (req, res) => { ... };
// exports.getContactById = async (req, res) => { ... };
// etc.
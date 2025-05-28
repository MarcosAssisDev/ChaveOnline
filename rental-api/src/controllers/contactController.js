const db = require('../services/db');


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

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

// [GET] Listar todos os apartamentos
exports.listApartments = async (req, res) => {
    const sql = `
        SELECT
            id,
            title,
            city,
            state,
            max_guests,
            daily_rate
        FROM apartments
        ORDER BY title;
    `;
    try {
        const apartments = await allAsync(sql);
        res.json(apartments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to retrieve apartments' });
    }
};

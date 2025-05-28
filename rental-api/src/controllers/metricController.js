const db = require('../services/db');
const { format, subDays } = require('date-fns'); // Para manipulação de datas


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

// [GET] Total de reservas e faturamento por canal no último mês
exports.getChannelSummary = async (req, res) => {
    const today = new Date();
    const thirtyDaysAgo = format(subDays(today, 30), 'yyyy-MM-dd');

    const sql = `
        SELECT
            channel,
            COUNT(id) as total_reservations,
            SUM(total_price) as total_revenue
        FROM reservations
        WHERE date(created_at) >= ? 
        GROUP BY channel;
    `;

    try {
        const summary = await allAsync(sql, [thirtyDaysAgo]);
        if (summary.length === 0) {
            return res.json({ message: "No reservation data found for the last 30 days.", data: [] });
        }
        res.json(summary);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to retrieve channel summary' });
    }
};

// [GET] Lista de cidades com mais reservas
exports.getTopCities = async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    const sql = `
        SELECT
            a.city,
            COUNT(r.id) as total_reservations
        FROM reservations r
        JOIN apartments a ON r.apartment_id = a.id
        GROUP BY a.city
        ORDER BY total_reservations DESC
        LIMIT ?;
    `;

    try {
        const cities = await allAsync(sql, [limit]);
        res.json(cities);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to retrieve top cities by reservations' });
    }
};

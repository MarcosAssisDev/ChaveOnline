const db = require('../services/db');
const { differenceInDays, parseISO, isValid } = require('date-fns'); // Para cálculo de dias

// Helper function para rodar queries que retornam múltiplos resultados
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

// Helper function para rodar queries que retornam um único resultado (ou para INSERT/UPDATE/DELETE)
function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) { // Usar function() para ter acesso a this.lastID
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

// Helper function para buscar um único registro
function getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}


// [GET] Listar reservas (com dados do apartamento e do contato)
exports.listReservations = async (req, res) => {
    const sql = `
        SELECT
            r.id as reservation_id,
            r.checkin_date,
            r.checkout_date,
            r.guests,
            r.total_price,
            r.channel,
            r.created_at,
            a.id as apartment_id,
            a.title as apartment_title,
            a.city as apartment_city,
            a.state as apartment_state,
            c.id as contact_id,
            c.name as contact_name,
            c.email as contact_email
        FROM reservations r
        JOIN apartments a ON r.apartment_id = a.id
        JOIN contacts c ON r.contact_id = c.id
        ORDER BY r.created_at DESC;
    `;
    try {
        const reservations = await allAsync(sql);
        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to retrieve reservations' });
    }
};

// Função para verificar conflitos de reserva
async function checkForBookingConflict(apartment_id, checkin_date, checkout_date, excludeReservationId = null) {
    // A lógica de conflito é:
    // Uma nova reserva (NewStart, NewEnd) conflita com uma existente (ExistingStart, ExistingEnd) se:
    // (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
    let sql = `
        SELECT COUNT(*) as count
        FROM reservations
        WHERE apartment_id = ?
        AND date(checkout_date) > date(?) 
        AND date(checkin_date) < date(?)
    `;
    const params = [apartment_id, checkin_date, checkout_date];

    if (excludeReservationId) {
        sql += " AND id != ?";
        params.push(excludeReservationId);
    }

    const result = await getAsync(sql, params);
    return result.count > 0;
}


// [POST] Criar uma nova reserva
exports.createReservation = async (req, res) => {
    const { apartment_id, contact_id, checkin_date, checkout_date, guests, channel } = req.body;

    if (!apartment_id || !contact_id || !checkin_date || !checkout_date || !guests || !channel) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const startDate = parseISO(checkin_date);
    const endDate = parseISO(checkout_date);

    if (!isValid(startDate) || !isValid(endDate) || endDate <= startDate) {
        return res.status(400).json({ error: 'Invalid check-in or check-out date. Ensure YYYY-MM-DD format and checkout_date is after checkin_date.' });
    }
    
    try {
        // 1. Verificar se o apartamento existe e obter a diária e max_guests
        const apartment = await getAsync('SELECT daily_rate, max_guests FROM apartments WHERE id = ?', [apartment_id]);
        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        // 2. Verificar se o número de hóspedes excede a capacidade do apartamento
        if (guests > apartment.max_guests) {
            return res.status(400).json({ error: `Number of guests (${guests}) exceeds apartment capacity (${apartment.max_guests}).` });
        }

        // 3. Verificar conflito de datas
        const conflict = await checkForBookingConflict(apartment_id, checkin_date, checkout_date);
        if (conflict) {
            return res.status(409).json({ error: 'O apartamento já está reservado nessa data.' }); // 409 Conflict
        }

        // 4. Calcular o total_price
        const numberOfNights = differenceInDays(endDate, startDate);
        if (numberOfNights <= 0) { // Redundante devido à validação anterior, mas bom ter
            return res.status(400).json({ error: 'Checkout date must be after check-in date.' });
        }
        const totalPrice = numberOfNights * apartment.daily_rate;

        // 5. Inserir a reserva
        const sqlInsert = `
            INSERT INTO reservations (apartment_id, contact_id, checkin_date, checkout_date, guests, total_price, channel)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const result = await runAsync(sqlInsert, [apartment_id, contact_id, checkin_date, checkout_date, guests, totalPrice, channel]);
        res.status(201).json({ id: result.lastID, message: 'Reservation created successfully', total_price: totalPrice });

    } catch (err) {
        console.error("Error creating reservation:", err.message);
        if (err.message.includes('FOREIGN KEY constraint failed')) {
            return res.status(400).json({ error: 'Invalid apartment_id or contact_id.' });
        }
        res.status(500).json({ error: 'Failed to create reservation' });
    }
};

// [GET] Buscar reservas por intervalo de datas e cidade
exports.searchReservations = async (req, res) => {
    const { startDate, endDate, city } = req.query;

    if (!startDate || !endDate || !city) {
        return res.status(400).json({ error: 'Missing required query parameters: startDate, endDate, city' });
    }

    // Validação básica de formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    
    // A query busca reservas cujo período (checkin_date a checkout_date)
    // se sobreponha com o período de busca (startDate a endDate) E que sejam na cidade especificada.
    const sql = `
        SELECT
            r.id as reservation_id,
            r.checkin_date,
            r.checkout_date,
            r.guests,
            r.total_price,
            r.channel,
            a.title as apartment_title,
            a.city as apartment_city,
            c.name as contact_name
        FROM reservations r
        JOIN apartments a ON r.apartment_id = a.id
        JOIN contacts c ON r.contact_id = c.id
        WHERE a.city = ? AND
              r.checkin_date < ? AND r.checkout_date > ?
        ORDER BY r.checkin_date;
    `;
    // Nota: A lógica de sobreposição de datas pode ser complexa.
    // Esta é uma forma comum: (StartA < EndB) and (EndA > StartB)
    // No nosso caso: (r.checkin_date < endDate) AND (r.checkout_date > startDate)

    try {
        const reservations = await allAsync(sql, [city, endDate, startDate]);
        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to search reservations' });
    }
};

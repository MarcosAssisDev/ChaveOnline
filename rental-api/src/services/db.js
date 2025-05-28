// src/services/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '..', '..', 'database', 'rental.db');
const schemaPath = path.resolve(__dirname, '..', '..', 'database', 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.exec('PRAGMA foreign_keys = ON;', (pragmaErr) => {
            if (pragmaErr) console.error("Failed to enable foreign keys:", pragmaErr.message);
        });

        fs.readFile(schemaPath, 'utf8', (fsErr, schemaSql) => {
            if (fsErr) {
                console.error('Error reading schema.sql:', fsErr.message);
                return;
            }
            db.exec(schemaSql, (execErr) => {
                if (execErr) {
                    console.error('Error executing schema:', execErr.message);
                } else {
                    console.log('Database schema initialized (or already exists).');
                    // Após inicializar o schema, vamos popular com dados iniciais se necessário
                    seedInitialData(); 
                }
            });
        });
    }
});

// Função para adicionar dados iniciais
function seedInitialData() {
    const apartments = [
        { title: 'Apto Aconchegante Centro', city: 'Bauru', state: 'SP', max_guests: 4, daily_rate: 150.00 },
        { title: 'Cobertura Vista Mar', city: 'Santos', state: 'SP', max_guests: 6, daily_rate: 350.00 },
        { title: 'Casa de Campo Tranquila', city: 'Botucatu', state: 'SP', max_guests: 8, daily_rate: 280.00 },
        { title: 'Studio Moderno Vila Mariana', city: 'São Paulo', state: 'SP', max_guests: 2, daily_rate: 180.00 },
        { title: 'Flat Executivo Itaim', city: 'São Paulo', state: 'SP', max_guests: 3, daily_rate: 220.00 }
    ];

    const contacts = [
        { name: 'João Silva', email: 'joao.silva@example.com', phone: '14999998888', type: 'individual', document: '123.456.789-00' },
        { name: 'Maria Oliveira', email: 'maria.oliveira@example.com', phone: '11988887777', type: 'individual', document: '987.654.321-00' },
        { name: 'Empresa X Soluções', email: 'contato@empresax.com', phone: '1432225555', type: 'company', document: '12.345.678/0001-99' },
        { name: 'Pedro Martins', email: 'pedro.martins@example.com', phone: '21977776666', type: 'individual', document: '456.123.789-01' },
        { name: 'Ana Costa', email: 'ana.costa@example.com', phone: '14966665555', type: 'individual', document: '789.123.456-02' }
    ];

    // Verifica se a tabela apartments está vazia antes de inserir
    db.get("SELECT COUNT(*) as count FROM apartments", (err, row) => {
        if (err) {
            console.error("Error checking apartments count:", err.message);
            return;
        }
        if (row.count === 0) {
            const stmtApt = db.prepare("INSERT INTO apartments (title, city, state, max_guests, daily_rate) VALUES (?, ?, ?, ?, ?)");
            apartments.forEach(apt => stmtApt.run(apt.title, apt.city, apt.state, apt.max_guests, apt.daily_rate));
            stmtApt.finalize(err => {
                if(err) console.error("Error seeding apartments:", err.message);
                else console.log("Apartments seeded successfully.");
            });
        } else {
            console.log("Apartments table already has data. Skipping seed.");
        }
    });

    // Verifica se a tabela contacts está vazia antes de inserir
    db.get("SELECT COUNT(*) as count FROM contacts", (err, row) => {
        if (err) {
            console.error("Error checking contacts count:", err.message);
            return;
        }
        if (row.count === 0) {
            const stmtCtc = db.prepare("INSERT INTO contacts (name, email, phone, type, document) VALUES (?, ?, ?, ?, ?)");
            contacts.forEach(ctc => stmtCtc.run(ctc.name, ctc.email, ctc.phone, ctc.type, ctc.document));
            stmtCtc.finalize(err => {
                if(err) console.error("Error seeding contacts:", err.message);
                else console.log("Contacts seeded successfully.");
            });
        } else {
            console.log("Contacts table already has data. Skipping seed.");
        }
    });
}

module.exports = db;
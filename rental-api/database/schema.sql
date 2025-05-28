-- Tabela de Apartamentos
CREATE TABLE IF NOT EXISTS apartments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    max_guests INTEGER NOT NULL,
    daily_rate REAL NOT NULL
);

-- Tabela de Contatos (Clientes)
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    type TEXT CHECK(type IN ('individual', 'company')) NOT NULL, -- 'individual' ou 'company'
    document TEXT UNIQUE NOT NULL -- CPF ou CNPJ
);

-- Tabela de Reservas
CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    apartment_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    checkin_date TEXT NOT NULL, -- Formato YYYY-MM-DD
    checkout_date TEXT NOT NULL, -- Formato YYYY-MM-DD
    guests INTEGER NOT NULL,
    total_price REAL NOT NULL, -- Calculado no momento da criação
    channel TEXT CHECK(channel IN ('airbnb', 'booking.com', 'direto')) NOT NULL, -- 'airbnb', 'booking.com', 'direto'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (apartment_id) REFERENCES apartments (id),
    FOREIGN KEY (contact_id) REFERENCES contacts (id)
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar buscas comuns
CREATE INDEX IF NOT EXISTS idx_apartments_city ON apartments (city);
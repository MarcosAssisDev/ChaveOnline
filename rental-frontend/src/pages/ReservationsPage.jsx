// src/pages/ReservationsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiService';

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtros
    const [filterCity, setFilterCity] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    const fetchReservations = useCallback(async (params = {}) => {
        setLoading(true);
        setError('');
        try {
            let url = '/reservations';
            if (params.city && params.startDate && params.endDate) {
                // Se todos os filtros de busca estiverem presentes, usa o endpoint de busca
                url = `/reservations/search?city=${encodeURIComponent(params.city)}&startDate=${params.startDate}&endDate=${params.endDate}`;
            } else if (Object.keys(params).length > 0 && !(params.city && params.startDate && params.endDate)) {
                // Se alguns filtros estão presentes mas não todos para a busca específica,
                // poderia indicar um erro de UI ou lógica, ou simplesmente carregar tudo.
                // Por simplicidade, se não for uma busca completa, carregamos todas as reservas.
                // Ou você pode mostrar uma mensagem para o usuário preencher todos os campos de busca.
                console.warn("Para buscar, preencha cidade, data de início e data de fim.");
                // Vamos carregar todas se a busca não estiver completa.
            }
            
            const response = await apiClient.get(url);
            setReservations(response.data || []); // Garante que seja um array
        } catch (err) {
            console.error("Erro ao buscar reservas:", err);
            setError('Falha ao carregar reservas. ' + (err.response?.data?.error || err.message));
            setReservations([]); // Limpa em caso de erro
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReservations(); // Carrega todas as reservas inicialmente
    }, [fetchReservations]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!filterCity || !filterStartDate || !filterEndDate) {
            setError("Por favor, preencha a cidade, data de início e data de fim para buscar.");
            // Se quiser limpar a lista atual ou recarregar todas as reservas caso os filtros sejam limpos:
            // fetchReservations(); // Recarrega todas se a busca for inválida/incompleta
            return;
        }
        setError(''); // Limpa erros anteriores
        fetchReservations({ city: filterCity, startDate: filterStartDate, endDate: filterEndDate });
    };

    const handleClearFilters = () => {
        setFilterCity('');
        setFilterStartDate('');
        setFilterEndDate('');
        setError('');
        fetchReservations(); // Recarrega todas as reservas
    };


    return (
        <div>
            <h1>Minhas Reservas</h1>
            <Link to="/reservations/new">
                <button style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>Adicionar Nova Reserva</button>
            </Link>

            <form onSubmit={handleSearch} style={filterFormStyle}>
                <h3>Filtrar Reservas</h3>
                <div style={filterGroupStyle}>
                    <label htmlFor="filterCity">Cidade:</label>
                    <input
                        type="text"
                        id="filterCity"
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        placeholder="Nome da cidade"
                        style={inputStyle}
                    />
                </div>
                <div style={filterGroupStyle}>
                    <label htmlFor="filterStartDate">Data Início (Check-in):</label>
                    <input
                        type="date"
                        id="filterStartDate"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                <div style={filterGroupStyle}>
                    <label htmlFor="filterEndDate">Data Fim (Check-out):</label>
                    <input
                        type="date"
                        id="filterEndDate"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                    <button type="submit" style={buttonStyle}>Buscar</button>
                    <button type="button" onClick={handleClearFilters} style={{...buttonStyle, backgroundColor: '#6c757d'}}>Limpar Filtros</button>
                </div>
            </form>

            {loading && <p>Carregando reservas...</p>}
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            
            {!loading && !error && (
                reservations.length > 0 ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID Reserva</th>
                                <th style={thStyle}>Apartamento</th>
                                <th style={thStyle}>Cidade</th>
                                <th style={thStyle}>Cliente</th>
                                <th style={thStyle}>Check-in</th>
                                <th style={thStyle}>Check-out</th>
                                <th style={thStyle}>Hóspedes</th>
                                <th style={thStyle}>Preço Total</th>
                                <th style={thStyle}>Canal</th>
                                <th style={thStyle}>Criada em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.reservation_id || reservation.id}>
                                    <td style={tdStyle}>{reservation.reservation_id || reservation.id}</td>
                                    <td style={tdStyle}>{reservation.apartment_title}</td>
                                    <td style={tdStyle}>{reservation.apartment_city}</td>
                                    <td style={tdStyle}>{reservation.contact_name}</td>
                                    <td style={tdStyle}>{new Date(reservation.checkin_date).toLocaleDateString()}</td>
                                    <td style={tdStyle}>{new Date(reservation.checkout_date).toLocaleDateString()}</td>
                                    <td style={tdStyle}>{reservation.guests}</td>
                                    <td style={tdStyle}>R$ {Number(reservation.total_price).toFixed(2)}</td>
                                    <td style={tdStyle}>{reservation.channel}</td>
                                    <td style={tdStyle}>{new Date(reservation.created_at || Date.now()).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{marginTop: '1rem'}}>Nenhuma reserva encontrada.</p>
                )
            )}
        </div>
    );
};

// Estilos básicos para o exemplo
const filterFormStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
};

const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
};

const inputStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
};

const buttonStyle = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
};

const thStyle = {
    borderBottom: '2px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
};

const tdStyle = {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
};

export default ReservationsPage;
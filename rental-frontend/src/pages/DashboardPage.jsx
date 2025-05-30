//
import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiService'; 

const DashboardPage = () => {
    const [channelSummary, setChannelSummary] = useState([]);
    const [topCities, setTopCities] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [loadingCities, setLoadingCities] = useState(true);
    const [errorSummary, setErrorSummary] = useState('');
    const [errorCities, setErrorCities] = useState('');

    useEffect(() => {
        const fetchChannelSummary = async () => {
            try {
                setLoadingSummary(true);
                setErrorSummary('');
                const response = await apiClient.get('/metrics/channel-summary');
                setChannelSummary(response.data.length > 0 ? response.data : []); 
            } catch (err) {
                console.error("Erro ao buscar resumo por canal:", err);
                setErrorSummary('Falha ao carregar resumo por canal. ' + (err.response?.data?.error || err.message));
                setChannelSummary([]); 
            } finally {
                setLoadingSummary(false);
            }
        };

        const fetchTopCities = async () => {
            try {
                setLoadingCities(true);
                setErrorCities('');
                const response = await apiClient.get('/metrics/top-cities?limit=5'); 
                setTopCities(response.data);
            } catch (err) {
                console.error("Erro ao buscar top cidades:", err);
                setErrorCities('Falha ao carregar top cidades. ' + (err.response?.data?.error || err.message));
            } finally {
                setLoadingCities(false);
            }
        };

        fetchChannelSummary();
        fetchTopCities();
    }, []);

    const totalReservationsLastMonth = channelSummary.reduce((acc, item) => acc + item.total_reservations, 0);
    const totalRevenueLastMonth = channelSummary.reduce((acc, item) => acc + item.total_revenue, 0);


     
    const sectionTitleStyle = { 
        color: '#0056b3', 
        borderBottom: '2px solid #007bff',
        paddingBottom: '0.3em',
        marginBottom: '1em',
    };
    
    const metricGridStyle = { 
        display: 'flex',
        flexWrap: 'wrap', 
        gap: '20px', 
        marginBottom: '2rem',
    };

    const metricCardStyle = {
        backgroundColor: '#ffffff', 
        border: '1px solid #e0e0e0',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        flex: '1', 
        minWidth: '220px', 
        color: '#333333', 
    };

    const metricLabelStyle = { 
        fontSize: '1.1rem',
        color: '#555555', 
        marginBottom: '0.5rem',
    };

    const metricValueStyle = {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        color: '#007bff', 
    };

    const listStyle = {
        listStyleType: 'none',
        padding: 0,
        marginTop: '0.5rem',
    };

    const listItemStyle = {
        padding: '10px 0',
        borderBottom: '1px solid #f0f0f0',
        color: '#333333', 
        display: 'flex',
        justifyContent: 'space-between',
    };
    
    const listItemStrongStyle = {
        color: '#0056b3', 
    };


    return (
        <div>
            <h1>Dashboard</h1>

            <div style={metricGridStyle}>
                <div style={metricCardStyle}>
                    <h3 style={metricLabelStyle}>Total de Reservas (Últimos 30 dias)</h3>
                    {loadingSummary ? <p>Carregando...</p> : errorSummary ? <p style={{color: 'red'}}>{errorSummary}</p> : <p style={metricValueStyle}>{totalReservationsLastMonth}</p>}
                </div>

                <div style={metricCardStyle}>
                    <h3 style={metricLabelStyle}>Faturamento Total (Últimos 30 dias)</h3>
                    {loadingSummary ? <p>Carregando...</p> : errorSummary ? <p style={{color: 'red'}}>{errorSummary}</p> : <p style={metricValueStyle}>R$ {totalRevenueLastMonth.toFixed(2)}</p>}
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ ...metricCardStyle, flexBasis: 'calc(50% - 10px)', minWidth: '300px' }}> {/* Ocupa metade da largura, com gap */}
                    <h2 style={sectionTitleStyle}>Faturamento por Canal</h2>
                    {loadingSummary ? <p>Carregando...</p> : errorSummary ? <p style={{color: 'red'}}>{errorSummary}</p> : (
                        channelSummary.length > 0 ? (
                            <ul style={listStyle}>
                                {channelSummary.map((item) => (
                                    <li key={item.channel} style={listItemStyle}>
                                        <span><strong style={listItemStrongStyle}>{item.channel}:</strong> {item.total_reservations} reservas</span>
                                        <span>R$ {Number(item.total_revenue).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>Nenhum dado de faturamento por canal encontrado.</p>
                    )}
                </div>

                <div style={{ ...metricCardStyle, flexBasis: 'calc(50% - 10px)', minWidth: '300px' }}> {/* Ocupa metade da largura, com gap */}
                    <h2 style={sectionTitleStyle}>Cidades com Mais Reservas (Top 5)</h2>
                    {loadingCities ? <p>Carregando...</p> : errorCities ? <p style={{color: 'red'}}>{errorCities}</p> : (
                        topCities.length > 0 ? (
                            <ul style={listStyle}>
                                {topCities.map((item) => (
                                    <li key={item.city} style={listItemStyle}>
                                        <strong style={listItemStrongStyle}>{item.city}:</strong>
                                        <span>{item.total_reservations} reservas</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>Nenhuma cidade encontrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


export default DashboardPage;
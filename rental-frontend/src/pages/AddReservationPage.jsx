// src/pages/AddReservationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiService';

const AddReservationPage = () => {
    const [apartments, setApartments] = useState([]);
    const [contacts, setContacts] = useState([]);
    
    const [selectedApartmentId, setSelectedApartmentId] = useState('');
    const [selectedContactId, setSelectedContactId] = useState('');
    const [checkinDate, setCheckinDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [channel, setChannel] = useState('direto'); 

    const [loadingApartments, setLoadingApartments] = useState(true);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [errorApartments, setErrorApartments] = useState('');
    const [errorContacts, setErrorContacts] = useState('');

    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                setErrorApartments('');
                const response = await apiClient.get('/apartments');
                setApartments(response.data || []);
            } catch (err) {
                console.error("Erro ao buscar apartamentos:", err);
                setErrorApartments('Falha ao carregar apartamentos. ' + (err.response?.data?.error || err.message));
            } finally {
                setLoadingApartments(false);
            }
        };

        const fetchContacts = async () => {
            try {
                setErrorContacts('');
                const response = await apiClient.get('/contacts');
                setContacts(response.data || []);
            } catch (err) {
                console.error("Erro ao buscar contatos:", err);
                setErrorContacts('Falha ao carregar contatos. ' + (err.response?.data?.error || err.message));
            } finally {
                setLoadingContacts(false);
            }
        };

        fetchApartments();
        fetchContacts();
    }, []);

    const validateForm = () => {
        if (!selectedApartmentId || !selectedContactId || !checkinDate || !checkoutDate || !guests || !channel) {
            setFormError('Todos os campos são obrigatórios.');
            return false;
        }
        if (new Date(checkoutDate) <= new Date(checkinDate)) {
            setFormError('A data de check-out deve ser posterior à data de check-in.');
            return false;
        }
        if (guests <= 0) {
            setFormError('O número de hóspedes deve ser pelo menos 1.');
            return false;
        }
        
        const selectedApartment = apartments.find(apt => apt.id === parseInt(selectedApartmentId));
        if (selectedApartment && guests > selectedApartment.max_guests) {
            setFormError(`O número de hóspedes (${guests}) excede a capacidade máxima do apartamento (${selectedApartment.max_guests}).`);
            return false;
        }

        setFormError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSuccess('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const reservationData = {
                apartment_id: parseInt(selectedApartmentId),
                contact_id: parseInt(selectedContactId),
                checkin_date: checkinDate,
                checkout_date: checkoutDate,
                guests: parseInt(guests),
                channel: channel,
            };
            // O total_price é calculado no backend

            await apiClient.post('/reservations', reservationData);
            setFormSuccess('Reserva criada com sucesso! Redirecionando...');
            
            // Limpar formulário (opcional, já que vamos redirecionar)
            setSelectedApartmentId('');
            setSelectedContactId('');
            setCheckinDate('');
            setCheckoutDate('');
            setGuests(1);
            setChannel('direto');

            setTimeout(() => {
                navigate('/reservations'); // Redireciona para a lista de reservas
            }, 2000);

        } catch (err) {
            console.error("Erro ao criar reserva:", err);
            setFormError('Falha ao criar reserva. ' + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const channelOptions = ['direto', 'airbnb', 'booking.com'];

    return (
        <div>
            <h1>Adicionar Nova Reserva</h1>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={formGroupStyle}>
                    <label htmlFor="apartment">Apartamento:</label>
                    {loadingApartments ? <p>Carregando apartamentos...</p> : errorApartments ? <p style={{color: 'red'}}>{errorApartments}</p> : (
                        <select id="apartment" value={selectedApartmentId} onChange={(e) => setSelectedApartmentId(e.target.value)} required style={inputStyle}>
                            <option value="">Selecione um apartamento</option>
                            {apartments.map(apt => (
                                <option key={apt.id} value={apt.id}>
                                   {apt.city} - {apt.title} (Max Hóspedes: {apt.max_guests}, Diária: R${Number(apt.daily_rate).toFixed(2)})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="contact">Contato (Cliente):</label>
                    {loadingContacts ? <p>Carregando contatos...</p> : errorContacts ? <p style={{color: 'red'}}>{errorContacts}</p> : (
                        <select id="contact" value={selectedContactId} onChange={(e) => setSelectedContactId(e.target.value)} required style={inputStyle}>
                            <option value="">Selecione um contato</option>
                            {contacts.map(contact => (
                                <option key={contact.id} value={contact.id}>{contact.name} ({contact.email})</option>
                            ))}
                        </select>
                    )}
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="checkinDate">Data de Check-in:</label>
                    <input type="date" id="checkinDate" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} required style={inputStyle} />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="checkoutDate">Data de Check-out:</label>
                    <input type="date" id="checkoutDate" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} required style={inputStyle} />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="guests">Número de Hóspedes:</label>
                    <input type="number" id="guests" value={guests} min="1" onChange={(e) => setGuests(parseInt(e.target.value))} required style={inputStyle} />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="channel">Canal da Reserva:</label>
                    <select id="channel" value={channel} onChange={(e) => setChannel(e.target.value)} required style={inputStyle}>
                        {channelOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                    </select>
                </div>

                {formError && <p style={{ color: 'red', marginTop: '10px' }}>{formError}</p>}
                {formSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{formSuccess}</p>}

                <button type="submit" disabled={isSubmitting} style={{...buttonStyle, marginTop: '20px'}}>
                    {isSubmitting ? 'Criando Reserva...' : 'Criar Reserva'}
                </button>
            </form>
        </div>
    );
};

// Estilos básicos (podem ser os mesmos da ReservationsPage ou ajustados)
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
};

const formGroupStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
};

const inputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginTop: '5px',
};

const buttonStyle = {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    opacity: 1,
};

export default AddReservationPage;
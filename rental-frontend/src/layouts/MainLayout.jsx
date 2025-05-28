// src/layouts/MainLayout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyle = {
        backgroundColor: '#ffffff', // Navbar com fundo branco
        padding: '1rem 2rem', // Aumenta padding lateral
        marginBottom: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Sombra suave
        display: 'flex',
        justifyContent: 'space-between', // Para alinhar logo à esquerda e links/botão à direita
        alignItems: 'center',
    };

    const logoStyle = {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#007bff', // Logo com a cor primária
    };
    
    const navLinkStyle = {
        margin: '0 0.75rem', // Espaçamento entre links
        color: '#333', // Cor dos links da nav
        fontWeight: '500',
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>ChaveOnline</Link>
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
                        <Link to="/reservations" style={navLinkStyle}>Reservas</Link>
                        <Link to="/reservations/new" style={navLinkStyle}>Nova Reservar</Link>
                        {/* O link de Nova Reserva já existe na página de Reservas */}
                        <span style={{ ...navLinkStyle, color: '#555' }}>Olá, {user?.username || 'Usuário'}!</span>
                        <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={navLinkStyle}>Login</Link>
                        <Link to="/register" style={navLinkStyle}>Registrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const MainLayout = ({ children }) => {
    const mainContainerStyle = {
        maxWidth: '1200px', // Largura máxima da aplicação
        margin: '0 auto',    // Centraliza horizontalmente
        padding: '0 20px 20px 20px', // Padding lateral e inferior
        flexGrow: 1, // Faz o conteúdo principal crescer para empurrar o footer para baixo
    };
    
    const appWrapperStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Garante que o wrapper ocupe toda a altura da viewport
    };

    const footerStyle = {
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#ffffff', // Footer com fundo branco
        color: '#555',
        marginTop: 'auto', // Empurra o footer para o final se o conteúdo for pequeno
    };


    return (
        <div style={appWrapperStyle}> {/* Envolve tudo para o minHeight e flex direction */}
            <Navbar />
            <main style={mainContainerStyle}>
                {children}
            </main>
            <footer style={footerStyle}>
                <p>&copy; {new Date().getFullYear()} ChaveOnline MVP</p>
            </footer>
        </div>
    );
};

export default MainLayout;
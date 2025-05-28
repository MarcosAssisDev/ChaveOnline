//
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
        backgroundColor: '#ffffff', 
        padding: '1rem 2rem', 
        marginBottom: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
    };

    const logoStyle = {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#007bff', 
    };
    
    const navLinkStyle = {
        margin: '0 0.75rem', 
        color: '#333', 
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
                        <Link to="/reservations/new" style={navLinkStyle}>Nova Reserva</Link>
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
        maxWidth: '1200px', 
        margin: '0 auto',    
        padding: '0 20px 20px 20px', 
        flexGrow: 1, 
    };
    
    const appWrapperStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', 
    };

    const footerStyle = {
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#ffffff', 
        color: '#555',
        marginTop: 'auto', 
    };


    return (
        <div style={appWrapperStyle}> 
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

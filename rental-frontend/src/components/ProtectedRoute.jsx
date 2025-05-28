// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Você pode mostrar um spinner/loading aqui enquanto verifica a autenticação
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        // Redireciona para a página de login, guardando a localização atual
        // para que o usuário possa ser redirecionado de volta após o login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
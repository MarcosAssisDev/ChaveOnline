// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; 
import ReservationsPage from './pages/ReservationsPage'; 
import AddReservationPage from './pages/AddReservationPage'; 
import NotFoundPage from './pages/NotFoundPage'; 
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <MainLayout>
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rota Raiz - Redireciona para o dashboard se logado, senão para login */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                    }
                />

                {/* Rotas Protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reservations"
                    element={
                        <ProtectedRoute>
                            <ReservationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reservations/new"
                    element={
                        <ProtectedRoute>
                            <AddReservationPage />
                        </ProtectedRoute>
                    }
                />
                {/* Adicione outras rotas protegidas aqui */}

                {/* Rota para Página Não Encontrada */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
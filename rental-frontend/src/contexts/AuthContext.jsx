// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // Inicia como true

    useEffect(() => {
        const verifyUserToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                // Define o token para o apiClient usar na requisição /me
                // O interceptor do apiClient já faz isso, mas podemos ser explícitos para clareza
                // ou se o apiClient ainda não tivesse o token no momento da primeira chamada.
                // No nosso caso, o interceptor deve pegar.
                
                try {
                    const response = await apiClient.get('/auth/me'); // Chama o novo endpoint
                    setUser(response.data); // response.data deve ser o objeto user {id, username}
                    setToken(storedToken); // Garante que o token no estado está correto
                } catch (error) {
                    console.error("Falha ao verificar token ou token inválido:", error.response?.data?.msg || error.message);
                    localStorage.removeItem('token'); // Remove token inválido
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false); // Define loading como false APÓS a tentativa de verificação
        };

        verifyUserToken();
    }, []); // Executa apenas uma vez na montagem

    const login = async (username, password) => {
        const response = await apiClient.post('/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        // Após o login, buscar os dados do usuário para popular o estado 'user' corretamente
        try {
            const userResponse = await apiClient.get('/auth/me'); // O token já estará no header via interceptor
            setUser(userResponse.data);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário após login:", error);
            // Lidar com o erro, talvez deslogar se não conseguir dados do usuário
            setUser(null); 
        }
        return response;
    };

    const register = async (username, password) => {
        return apiClient.post('/auth/register', { username, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // Opcional: chamar um endpoint /auth/logout no backend se ele invalidar tokens
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!user && !!token }}>
            {!loading && children} {/* Renderiza children somente quando loading for false */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
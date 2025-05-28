import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: baseURL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

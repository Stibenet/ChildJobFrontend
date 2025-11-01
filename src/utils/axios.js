import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

const apiClient = axios.create({
    baseURL: API_URL,
});

// Перехватчик запросов для добавления токена
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Перехватчик ответов для обработки 401 (неавторизован)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Удалить токен и перенаправить на логин
            localStorage.removeItem('userToken');
            window.location.href = '/login'; // Или this.$router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
import axios from 'axios';
import { storage } from '../utils/storage';

const apiInstance = axios.create({
    baseURL: 'https://aapsuj.accevate.co/flutter-api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Bearer token if available
apiInstance.interceptors.request.use(
    async (config) => {
        const token = await storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiInstance;

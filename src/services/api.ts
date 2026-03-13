import axios from 'axios';
import router from '../router';
import { storage } from '../services/storage';
import { socketService } from './socket';

let memoryToken: string | null = null;

const normalizeBaseUrl = (url: string) => {
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const getBaseUrl = () => {
    const runtimeUrl = storage.get('apiBaseUrl');
    if (runtimeUrl && typeof runtimeUrl === 'string') {
        return normalizeBaseUrl(runtimeUrl);
    }

    const url = import.meta.env.VITE_API_URL;
    if (url && typeof url === 'string') {
        return normalizeBaseUrl(url);
    }
    return '/api';
};

const baseURL = getBaseUrl();

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // 1. Priority: Manual Token Override (already set in config)
        if (config.headers.Authorization) return config;

        // 2. Memory Token (for non-persisted sessions)
        const token = memoryToken || storage.get('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Set the authorization header globally for all future requests
 */
export const setAuthToken = (token: string | null) => {
    memoryToken = token;
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        socketService.connect();
    } else {
        delete api.defaults.headers.common['Authorization'];
        socketService.disconnect();
    }
};

export const setApiBaseUrl = (baseUrl: string) => {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    storage.set('apiBaseUrl', normalizedBaseUrl);
    api.defaults.baseURL = normalizedBaseUrl;
    socketService.disconnect();
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            storage.delete('accessToken');
            storage.delete('user');
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default api;

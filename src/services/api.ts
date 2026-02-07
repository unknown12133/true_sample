import axios from 'axios';

import { Product, ProductPayload } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors systematically if needed
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // consistently return the error message or object
        const customError = error.response ? error.response.data : error.message;
        return Promise.reject(customError);
    }
);

export const api = {
    // Auth
    auth: {
        login: (credentials: { mobile: string; password: string }) => apiClient.post('/auth/login', credentials).then(res => res.data),
    },

    // Products
    products: {
        getAll: () => apiClient.get('/products').then(res => res.data as Product[]),
        add: (payload: ProductPayload) => apiClient.post('/products', payload).then(res => res.data),
        update: (productId: string, payload: ProductPayload) => apiClient.put(`/products/${productId}`, payload).then(res => res.data),
        delete: (productId: string, userid: string) => apiClient.delete(`/products/${productId}`, { params: { userid } }).then(res => res.data),
    },

    // Subscriptions
    subscriptions: {
        getAll: () => apiClient.get('/subscription-plans').then(res => res.data),
        create: (payload: any) => apiClient.post('/subscription-plans', payload).then(res => res.data),
        update: (planId: string, payload: any) => apiClient.put(`/subscription-plans/${planId}`, payload).then(res => res.data),
        delete: (planId: string, userid: string) => apiClient.delete(`/subscription-plans/${planId}`, { params: { userid } }).then(res => res.data), // Assuming delete endpoint exists or based on future needs
    },

    // Orders
    orders: {
        getAll: () => apiClient.get('/orders').then(res => res.data),
    },

    // Users
    users: {
        getAll: () => apiClient.get('/users').then(res => res.data),
        getDetails: (identifier: string) => apiClient.get(`/users/${identifier}`).then(res => res.data),
        create: (payload: any) => apiClient.post('/users', payload).then(res => res.data),
        update: (identifier: string, payload: any) => apiClient.put(`/users/${identifier}`, payload).then(res => res.data),
        delete: (identifier: string) => apiClient.delete(`/users/${identifier}`).then(res => res.data),
    },
};

export default api;

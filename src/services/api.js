import axios from 'axios';
import { showError } from './toastService';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle error secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Terjadi kesalahan.';

    showError(message); // tampilkan toast error
    return Promise.reject(error); // tetap lempar agar bisa ditangani di catch
  }
);

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const getEmployees = async (params = {}) => {
  console.log(params);
  const response = await api.get('/employees', {params});
  return response.data.data;
};

export default api;
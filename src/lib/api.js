import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// ⬇️ Aqui é o que está faltando: interceptador para adicionar o token JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // mesmo nome usado no AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

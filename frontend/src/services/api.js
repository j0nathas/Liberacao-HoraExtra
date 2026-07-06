import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.109.133.63:3005'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
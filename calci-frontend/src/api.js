import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-calci.onrender.com/api',
});

export const calculate = (num1, num2, operation) =>
  API.post('/calculate', { num1, num2, operation });

export const getHistory = () => API.get('/history');

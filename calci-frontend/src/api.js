import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-calci.onrender.com/api',
});

export const calculate = (num1, num2, operation) =>
  API.post('/calculate', { num1, num2, operation });

export const getHistory = () => API.get('/history');

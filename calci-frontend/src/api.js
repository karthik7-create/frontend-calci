import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const calculate = (num1, num2, operation) =>
  API.post('/calculate', { num1, num2, operation });

export const getHistory = () => API.get('/history');

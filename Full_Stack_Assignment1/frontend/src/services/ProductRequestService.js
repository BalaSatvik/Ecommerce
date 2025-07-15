import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/product-requests';

export const getAllProducts = () => axios.get(`${API_BASE}/products`);

export const createProductRequest = (data) => axios.post(`${API_BASE}/create`, data);
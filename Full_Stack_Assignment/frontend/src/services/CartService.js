import axios from 'axios';

const API_BASE = '/api/cart';

export const getCartItems = (userId) => {
  return axios.get(`${API_BASE}/${userId}/items`);
};

export const addItemToCart = (userId, productId, quantity) => {
  return axios.post(`${API_BASE}/add`, {
    userId,
    productId,
    quantity
  });
};

export const removeCartItem = (cartItemId) => {
  return axios.delete(`${API_BASE}/item/${cartItemId}`);
};

export const clearCart = (userId) => {
  return axios.delete(`${API_BASE}/${userId}/clear`);
};

export const checkoutCart = (userId) => {
  return axios.post(`${API_BASE}/${userId}/checkout`);
};

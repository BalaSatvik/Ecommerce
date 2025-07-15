import axios from "axios";

const BASE_URL = "http://localhost:8080/api/product-approval";

export const getApprovedProducts = () =>
  axios.get(`${BASE_URL}/products`);

export const getPendingRequests = () =>
  axios.get(`${BASE_URL}/pending-requests`);

export const approveRequests = (payload) =>
  axios.post(`${BASE_URL}/approve`, payload);

export const rejectRequests = (productRequestIds, managerId) =>
  axios.post(`${BASE_URL}/reject`, [
    {
      productRequestIds,
      managerId
    }
  ]);
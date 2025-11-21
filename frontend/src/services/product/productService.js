
import apiClient from "../api/apiClient";

const productService = {
  getProducts: async (page = 1, limit = 8) => {
    const response = await apiClient.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response;
  },

  createProduct: async (data) => {
    const response = await apiClient.post(`/products/createProd`, data);
    return response;
  },

  updateProduct: async (id, data) => {
    const response = await apiClient.put(`/products/updateProd/${id}`, data);
    return response;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response;
  },
};

export default productService;

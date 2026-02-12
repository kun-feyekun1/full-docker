
import apiClient from "../api/apiClient";

const productService = {
  getProducts: async (page = 1, limit = 8) => {
    try {
      const response = await apiClient.get(
        `/products?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Get products error:", error);
      throw error;
    }
  },

 // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get product by ID error:", error);
      throw error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post(
        "/products/createProd",
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(
        `/products/updateProd/${id}`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Update product error:", error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete product error:", error);
      throw error;
    }
  },
};

export default productService;
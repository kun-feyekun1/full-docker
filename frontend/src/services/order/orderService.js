import apiClient from "../api/apiClient";

const orderService = {
  
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

  // ===== ORDERS =====
  fetchOrders: async (page = 1, limit = 8) => {
    try {
      const response = await apiClient.get(
        `/orders/getOrds?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetch orders error:", error);
      throw error;
    }
  },

  fetchOrderById: async (id) => {
    try {
      const response = await apiClient.get(
        `/orders/getOrdById/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetch order by ID error:", error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post(
        `/orders/createOrd`,
        orderData
      );
      return response.data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await apiClient.put(
        `/orders/${orderId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error("Update order status error:", error);
      throw error;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const response = await apiClient.delete(
        `/orders/delOrd/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Delete order error:", error);
      throw error;
    }
  },
};

export default orderService;

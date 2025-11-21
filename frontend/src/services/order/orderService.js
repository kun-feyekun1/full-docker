import apiClient from "../api/apiClient";

const orderService = {

  getProducts: async (page = 1, limit = 8) => {
    const response = await apiClient.get(`/products?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  fetchOrders: async (page = 1, limit = 8) => {
    const response = await apiClient.get(`/orders/getOrds?page=${page}&limit=${limit}`);
    return response.data;
  },

  fetchOrderById: async (id) => {
    const response = await apiClient.get(`/orders/getOrdById/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post(`/orders/createOrd`, orderData);
    return response.data;
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await apiClient.put(`/order/${orderId}/status`, statusData);
    return response.data;
  },

  deleteOrder: async (orderId) => {
    const response = await apiClient.delete(`${API_BASE_URL}/orders/delOrd/${orderId}`);
    return response.data;
  }
};

export default orderService;

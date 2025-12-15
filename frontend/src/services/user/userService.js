
import apiClient from '../api/apiClient';

const userService = {

  fetchUsers: async (page = 1, limit = 12) => {
    const response = await apiClient.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  fetchUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  fetchProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateUser: async (id, updateData) => {
    const response = await apiClient.put(`/users/${id}`, updateData);
    return response.data;
  },

  updateProfile: async (id, updateData) => {
    const response = await apiClient.put(`/users/${id}`, updateData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  deleteAllUsers: async () => {
    const response = await apiClient.delete('/users/deleteAllUsers');
    return response.data;
  }
};

export default userService;

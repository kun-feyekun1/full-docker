
import api from '../api/apiClient';

const userService = {

  fetchUsers: async (page = 1, limit = 12) => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  fetchUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  fetchProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateUser: async (id, updateData) => {
    const response = await api.put(`/users/${id}`, updateData);
    return response.data;
  },

  updateProfile: async (id, updateData) => {
    const response = await api.put(`/users/${id}`, updateData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },

  deleteAllUsers: async () => {
    const response = await api.delete('/user/deleteAllUsers');
    return response.data;
  }
};

export default userService;

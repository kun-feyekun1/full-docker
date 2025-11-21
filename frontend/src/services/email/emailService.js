import apiClient from '../api/apiClient';

const emailService = {
  fetchNotifications: async (page = 1, limit = 10) => {
    const res = await apiClient.get(`/emails/get-all?page=${page}&limit=${limit}`);
    return res.data;
  },

  fetchNotificationById: async (id) => {
    const res = await apiClient.get(`/emails/get-one/${id}`);
    return res.data;
  },

  deleteNotification: async (id) => {
    const res = await apiClient.delete(`/emails/del-by-id/${id}`);
    return res.data;
  },

  deleteMultipleNotifications: async (ids = [], hardDelete = false) => {
    const res = await apiClient.delete(`/emails/del-many`, { data: { ids, hardDelete } });
    return res.data;
  },

  deleteAllNotifications: async (hardDelete = false) => {
    const res = await apiClient.delete(`/emails/del-all`, { data: { hardDelete } });
    return res.data;
  },

  sendMeetingReminder: async () => {
    const res = await apiClient.post('/emails/send-reminder');
    return res.data;
  },

  sendCustomEmail: async (emailData) => {
    const res = await apiClient.post('/emails/send-login-notif', emailData);
    return res.data;
  },

  sendOrderConfirmation: async (orderData) => {
    const res = await apiClient.post('/emails/send-order-conf', orderData);
    return res.data;
  },
};

export default emailService;

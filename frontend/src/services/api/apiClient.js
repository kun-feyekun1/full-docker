
import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Network error', error);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.warn('Bad Request:', data.message || data);
        break;
      case 401:
        console.warn('Unauthorized — clearing session');
        localStorage.clear();
        window.location.href = '/login';
        break;
      case 403:
        console.warn('Forbidden');
        break;
      case 404:
        console.warn('Not Found');
        break;
      case 500:
        console.error('Server Error');
        break;
      default:
        console.warn('Unhandled Error:', data);
    }

    return Promise.reject(data);
  }
);

const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

export { api };
export default apiClient;

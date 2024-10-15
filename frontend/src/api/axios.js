import axios from 'axios';
import { apiURL } from './config';

const axiosInstance = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào headers nếu có
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;

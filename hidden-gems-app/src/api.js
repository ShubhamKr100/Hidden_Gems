
import axios from 'axios';

// Render URL or fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'https://hidden-gems-backend-q048.onrender.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach Bearer token if present
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });
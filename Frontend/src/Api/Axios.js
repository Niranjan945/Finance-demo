import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout if it's a 401 AND we aren't already trying to login
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      console.warn("Session expired or invalid token. Redirecting...");
      localStorage.removeItem('token');
      
      // Use window.location.replace to avoid back-button loops
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
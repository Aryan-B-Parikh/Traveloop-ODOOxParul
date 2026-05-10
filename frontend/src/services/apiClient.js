import axios from 'axios';

// Base URL for the backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically add the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Do not attach Authorization header for demo tokens (client-only sessions)
    if (token && !token.startsWith('demo-')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only perform a global sign-out redirect when we actually have
      // an auth token stored. This avoids redirecting users who hit
      // unauthenticated API endpoints (e.g. demo flows or public calls).
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('traveloop_session');
        // Allow React Router to handle navigation by setting location
        // — replace so back button doesn't return to protected page.
        window.location.replace('/auth');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

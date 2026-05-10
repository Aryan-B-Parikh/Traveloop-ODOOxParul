import { apiRequest } from './api';

export const authService = {
  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data?.token) {
      localStorage.setItem('traveloop_token', response.data.token);
      localStorage.setItem('traveloop_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async signup(userData) {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data?.token) {
      localStorage.setItem('traveloop_token', response.data.token);
      localStorage.setItem('traveloop_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    window.location.href = '/auth';
  },

  getCurrentUser() {
    const user = localStorage.getItem('traveloop_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('traveloop_token');
  }
};

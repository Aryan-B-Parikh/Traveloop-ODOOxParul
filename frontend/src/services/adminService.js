import apiClient from './apiClient';

export const getAdminStats = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data.data;
};

export const getAdminUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data.data.users || response.data.data; // Handle pagination wrapper if any
};

export const getAdminFlaggedTrips = async () => {
  // Backend doesn't support this yet, returning mock data
  return [
    { id: 101, title: 'Party in Vegas', author: 'WildUser99', flagReason: 'Inappropriate content in description', dateFlagged: '2026-05-09' },
    { id: 102, title: 'Spam Trip Links', author: 'Spammer123', flagReason: 'Contains spam/promotional links', dateFlagged: '2026-05-10' }
  ];
};

export const suspendUser = async (userId) => {
  return Promise.resolve({ success: true });
};

export const reactivateUser = async (userId) => {
  return Promise.resolve({ success: true });
};

export const dismissFlag = async (tripId) => {
  return Promise.resolve({ success: true });
};

export const removeTrip = async (tripId) => {
  return Promise.resolve({ success: true });
};

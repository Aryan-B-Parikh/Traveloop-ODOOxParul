import apiClient from './apiClient';

export const packingService = {
  async getItems(tripId) {
    const response = await apiClient.get(`/trips/${tripId}/packing-items`);
    return response.data.data;
  },

  async addItem(tripId, itemData) {
    const response = await apiClient.post(`/trips/${tripId}/packing-items`, itemData);
    return response.data.data;
  },

  async updateItem(tripId, itemId, updateData) {
    const response = await apiClient.put(`/trips/${tripId}/packing-items/${itemId}`, updateData);
    return response.data.data;
  },

  async deleteItem(tripId, itemId) {
    const response = await apiClient.delete(`/trips/${tripId}/packing-items/${itemId}`);
    return response.data.data;
  }
};

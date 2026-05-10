import { apiRequest } from './api';

export const packingService = {
  async getItems(tripId) {
    const response = await apiRequest(`/trips/${tripId}/packing-items`);
    return response.data;
  },

  async addItem(tripId, itemData) {
    const response = await apiRequest(`/trips/${tripId}/packing-items`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    return response.data;
  },

  async updateItem(tripId, itemId, updateData) {
    const response = await apiRequest(`/trips/${tripId}/packing-items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data;
  },

  async deleteItem(tripId, itemId) {
    const response = await apiRequest(`/trips/${tripId}/packing-items/${itemId}`, {
      method: 'DELETE',
    });
    return response.data;
  }
};

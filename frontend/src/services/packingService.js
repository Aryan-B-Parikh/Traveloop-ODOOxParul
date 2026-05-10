import apiClient from './apiClient';

export const packingService = {
  async getItems(tripId) {
    const response = await apiClient.get(/trips//packing-items);
    return response.data.data;
  },

  async addItem(tripId, itemData) {
    const response = await apiClient.post(/trips//packing-items, itemData);
    return response.data.data;
  },

  async updateItem(tripId, itemId, updateData) {
    const response = await apiClient.put(/trips//packing-items/, updateData);
    return response.data.data;
  },

  async deleteItem(tripId, itemId) {
    const response = await apiClient.delete(/trips//packing-items/);
    return response.data.data;
  }
};

import { apiRequest } from './api';

export const tripService = {
  async getTrips() {
    const response = await apiRequest('/trips');
    return response.data;
  },

  async getTripById(id) {
    const response = await apiRequest(`/trips/${id}`);
    return response.data;
  },

  async createTrip(tripData) {
    // Ensure dates are in the correct format for the backend (ISO)
    const formattedData = {
      ...tripData,
      startDate: new Date(tripData.startDate).toISOString(),
      endDate: new Date(tripData.endDate).toISOString(),
    };

    const response = await apiRequest('/trips', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
    return response.data;
  },

  async updateTrip(id, tripData) {
    const formattedData = {
      ...tripData,
      startDate: tripData.startDate ? new Date(tripData.startDate).toISOString() : undefined,
      endDate: tripData.endDate ? new Date(tripData.endDate).toISOString() : undefined,
    };

    const response = await apiRequest(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formattedData),
    });
    return response.data;
  },

  async deleteTrip(id) {
    const response = await apiRequest(`/trips/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  }
};

import { apiRequest } from './api';

export const itineraryService = {
  async getSections(tripId) {
    const response = await apiRequest(`/trips/${tripId}/sections`);
    return response.data;
  },

  async createSection(tripId, sectionData) {
    const response = await apiRequest(`/trips/${tripId}/sections`, {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
    return response.data;
  },

  async updateSection(tripId, sectionId, sectionData) {
    const response = await apiRequest(`/trips/${tripId}/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
    return response.data;
  },

  async deleteSection(tripId, sectionId) {
    const response = await apiRequest(`/trips/${tripId}/sections/${sectionId}`, {
      method: 'DELETE',
    });
    return response.data;
  }
};

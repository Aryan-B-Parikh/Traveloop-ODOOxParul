import apiClient from './apiClient';

export const getSections = async (tripId) => {
  const response = await apiClient.get(`/trips/${tripId}/sections`);
  return response.data.data;
};

export const createSection = async (tripId, sectionData) => {
  const response = await apiClient.post(`/trips/${tripId}/sections`, sectionData);
  return response.data.data;
};

export const updateSection = async (tripId, sectionId, sectionData) => {
  const response = await apiClient.put(`/trips/${tripId}/sections/${sectionId}`, sectionData);
  return response.data.data;
};

export const deleteSection = async (tripId, sectionId) => {
  await apiClient.delete(`/trips/${tripId}/sections/${sectionId}`);
};

// Export as object for backward compatibility with my previous edits
export const itineraryService = {
  getSections,
  createSection,
  updateSection,
  deleteSection
};

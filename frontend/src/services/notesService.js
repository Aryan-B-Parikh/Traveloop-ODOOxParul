import apiClient from './apiClient';

export const getNotes = async (tripId) => {
  const response = await apiClient.get(`/trips/${tripId}/notes`);
  return response.data.data;
};

export const createNote = async (tripId, noteData) => {
  const response = await apiClient.post(`/trips/${tripId}/notes`, noteData);
  return response.data.data;
};

export const updateNote = async (tripId, noteId, noteData) => {
  const response = await apiClient.put(`/trips/${tripId}/notes/${noteId}`, noteData);
  return response.data.data;
};

export const deleteNote = async (tripId, noteId) => {
  await apiClient.delete(`/trips/${tripId}/notes/${noteId}`);
};

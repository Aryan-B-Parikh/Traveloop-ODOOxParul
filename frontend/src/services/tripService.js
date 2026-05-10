import apiClient from './apiClient';

/**
 * Fetch all trips for the authenticated user.
 */
export const getTrips = async () => {
  const response = await apiClient.get('/trips');
  return response.data.data;
};

/**
 * Fetch a single trip by ID.
 */
export const getTrip = async (tripId) => {
  const response = await apiClient.get(`/trips/${tripId}`);
  return response.data.data;
};

/**
 * Create a new trip.
 */
export const createTrip = async (tripData) => {
  const response = await apiClient.post('/trips', tripData);
  return response.data.data;
};

/**
 * Update an existing trip.
 */
export const updateTrip = async (tripId, tripData) => {
  const response = await apiClient.put(`/trips/${tripId}`, tripData);
  return response.data.data;
};

/**
 * Delete a trip.
 */
export const deleteTrip = async (tripId) => {
  await apiClient.delete(`/trips/${tripId}`);
};

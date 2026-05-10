import apiClient from './apiClient';
import { sampleTrips } from '../data/sampleTrips';

/**
 * Fetch all trips for the authenticated user.
 */
export const getTrips = async () => {
  const token = localStorage.getItem('token');
  if (!token || token.startsWith('demo-')) {
    // Return local sample trips for demo/no-token sessions
    return sampleTrips;
  }

  const response = await apiClient.get('/trips');
  return response.data.data;
};

/**
 * Fetch a single trip by ID.
 */
export const getTrip = async (tripId) => {
  const token = localStorage.getItem('token');
  if (!token || token.startsWith('demo-')) {
    return sampleTrips.find((t) => String(t.id) === String(tripId)) || sampleTrips[0] || null;
  }

  const response = await apiClient.get(`/trips/${tripId}`);
  return response.data.data;
};

// Alias for compatibility
export const getTripById = getTrip;

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

// Object export for compatibility with friend's code
export const tripService = {
  getTrips,
  getTrip,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
};

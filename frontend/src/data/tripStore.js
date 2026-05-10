// tripStore.js — Centralized CRUD for trips using localStorage
// Seeds from sampleTrips on first load, then persists all mutations.

import { sampleTrips } from './sampleTrips';

const STORAGE_KEY = 'traveloop_trips';

/**
 * Read all trips from localStorage.
 * If nothing stored yet, seed from sampleTrips.
 */
export function getTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // First load — seed with sample data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTrips));
    return [...sampleTrips];
  } catch {
    return [...sampleTrips];
  }
}

/**
 * Get a single trip by ID.
 */
export function getTrip(id) {
  const trips = getTrips();
  return trips.find((t) => String(t.id) === String(id));
}

/**
 * Create or update a trip.
 * - If trip.id exists in the store → update.
 * - Otherwise → create with a new ID.
 * Returns the saved trip.
 */
export function saveTrip(trip) {
  const trips = getTrips();
  const existingIndex = trips.findIndex((t) => String(t.id) === String(trip.id));

  if (existingIndex >= 0) {
    // Update existing
    trips[existingIndex] = { ...trips[existingIndex], ...trip };
  } else {
    // Create new
    const newTrip = {
      ...trip,
      id: trip.id || `trip-${Date.now()}`,
      participants: trip.participants || [],
      image: trip.image || getDefaultImage(trips.length),
    };
    trips.push(newTrip);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return existingIndex >= 0 ? trips[existingIndex] : trips[trips.length - 1];
}

/**
 * Delete a trip by ID.
 * Returns true if deleted, false if not found.
 */
export function deleteTrip(id) {
  const trips = getTrips();
  const filtered = trips.filter((t) => String(t.id) !== String(id));
  if (filtered.length === trips.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Utility: cycle through cover images for new trips.
 */
function getDefaultImage(index) {
  const images = [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=600',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600',
  ];
  return images[index % images.length];
}

/**
 * Format date range for display: "Jun 08 - Jun 18"
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return '';
  try {
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);
    
    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
      return `${startDate} – ${endDate}`;
    }

    const opts = { month: 'short', day: '2-digit', timeZone: 'UTC' };
    const startStr = startObj.toLocaleDateString('en-US', opts);
    const endStr = endObj.toLocaleDateString('en-US', opts);
    
    if (startStr === 'Invalid Date' || endStr === 'Invalid Date') {
      return `${startDate} – ${endDate}`;
    }
    
    return `${startStr} – ${endStr}`;
  } catch {
    return `${startDate} – ${endDate}`;
  }
}

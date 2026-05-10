import apiClient from './apiClient';

const SESSION_KEY = 'traveloop_session';

/** Retrieve the stored session from localStorage (or null). */
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Persist a session object to localStorage. */
function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('token', session.token); // Store token specifically for apiClient
}

/** Remove the session from localStorage. */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('token');
}

/**
 * Login with email + password.
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login({ email, password }) {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const { user, token } = response.data.data;
    const session = { token, user };
    saveSession(session);
    return session;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred during login. Please try again.');
  }
}

/**
 * Register a new account.
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function register({ firstName, lastName, email, password }) {
  try {
    const username = email.split('@')[0];
    const response = await apiClient.post('/auth/signup', { firstName, lastName, email, password, username });
    const { user, token } = response.data.data;
    const session = { token, user };
    saveSession(session);
    return session;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred during registration. Please try again.');
  }
}

/**
 * Update the current user's profile.
 * @returns {Promise<{ user: object }>}
 */
export async function updateProfile(updatedFields) {
  try {
    const response = await apiClient.put('/auth/profile', updatedFields);
    const user = response.data.data;
    
    // Update local session
    const session = getStoredSession();
    if (session) {
      const updatedSession = { ...session, user };
      saveSession(updatedSession);
    }

    return { user };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update profile.');
  }
}

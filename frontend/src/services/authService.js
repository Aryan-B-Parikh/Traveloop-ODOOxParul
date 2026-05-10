import apiClient from './apiClient';

const SESSION_KEY = 'traveloop_session';

function extractApiErrorMessage(error, fallbackMessage) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    const detailMessage = error.response.data.details?.[0]?.message;
    return detailMessage || error.response.data.error;
  }

  return fallbackMessage;
}

function buildUsername({ firstName, lastName, email }) {
  const emailLocalPart = (email || '').split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
  const namePart = `${firstName || ''}${lastName || ''}`.replace(/[^a-zA-Z0-9_]/g, '');
  let username = emailLocalPart || namePart || 'user';

  // Backend validation requires min length 3 for username.
  if (username.length < 3) {
    username = `${username}${namePart || 'traveloop'}`;
  }

  return username.slice(0, 100);
}

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
    throw new Error(extractApiErrorMessage(error, 'An error occurred during login. Please try again.'));
  }
}

/**
 * Register a new account.
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function register({ firstName, lastName, email, password }) {
  try {
    const username = buildUsername({ firstName, lastName, email });
    const response = await apiClient.post('/auth/signup', { firstName, lastName, email, password, username });
    const { user, token } = response.data.data;
    const session = { token, user };
    saveSession(session);
    return session;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, 'An error occurred during registration. Please try again.'));
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
    throw new Error(extractApiErrorMessage(error, 'Failed to update profile.'));
  }
}

// Keep the old authService object for compatibility if needed, but pointing to the new functions
export const authService = {
  login: async (email, password) => login({ email, password }),
  signup: async (userData) => register(userData),
  logout: clearSession,
  getCurrentUser: () => getStoredSession()?.user,
  isAuthenticated: () => !!getStoredSession()?.token
};

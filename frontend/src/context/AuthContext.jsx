import React, { createContext, useContext, useState, useCallback } from 'react';
import { getStoredSession, clearSession } from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and exposes auth state globally.
 * Initialize from localStorage so the session survives a page refresh.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  const user = session?.user ?? null;
  const token = session?.token ?? null;
  const isAuthenticated = Boolean(token);

  /** Call after a successful login / register response. */
  const handleAuthSuccess = useCallback((newSession) => {
    setSession(newSession);
  }, []);

  /** Update user fields in context (called after profile save). */
  const updateUser = useCallback((updatedUser) => {
    setSession((prev) => ({ ...prev, user: updatedUser }));
  }, []);

  /** Clear session everywhere. */
  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, handleAuthSuccess, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook — throws if used outside AuthProvider. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

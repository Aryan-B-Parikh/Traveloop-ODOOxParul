import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import DestinationExplorer from './pages/DestinationExplorer';
import ItineraryBuilder from './pages/ItineraryBuilder';
import BudgetPlanner from './pages/BudgetPlanner';
import PackingChecklist from './pages/PackingChecklist';
import Profile from './pages/Profile';
import TripNotes from './pages/TripNotes';
import Community from './pages/Community';
import Admin from './pages/Admin';

/** Redirects unauthenticated users to /auth. */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected routes */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create"     element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/explore"    element={<ProtectedRoute><DestinationExplorer /></ProtectedRoute>} />
        <Route path="/itinerary"  element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
        <Route path="/budget"     element={<ProtectedRoute><BudgetPlanner /></ProtectedRoute>} />
        <Route path="/packing"    element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notes"      element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
        <Route path="/community"  element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/admin"      element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

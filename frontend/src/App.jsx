import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import DestinationExplorer from './pages/DestinationExplorer'
import ItineraryBuilder from './pages/ItineraryBuilder'
import BudgetPlanner from './pages/BudgetPlanner'
import PackingChecklist from './pages/PackingChecklist'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateTrip />} />
      <Route path="/explore" element={<DestinationExplorer />} />
      <Route path="/itinerary" element={<ItineraryBuilder />} />
      <Route path="/budget" element={<BudgetPlanner />} />
      <Route path="/packing" element={<PackingChecklist />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

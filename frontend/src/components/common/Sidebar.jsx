import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar card">
      <div style={{fontWeight: 700, marginBottom: 10}}>Planner</div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create">Create Trip</Link>
        <Link to="/itinerary">Itinerary Builder</Link>
        <Link to="/explore">Destination Explorer</Link>
        <Link to="/budget">Budget Planner</Link>
        <Link to="/packing">Packing Checklist</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </aside>
  )
}

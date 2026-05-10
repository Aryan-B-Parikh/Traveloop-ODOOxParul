import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar card">
      <div style={{fontWeight: 700, marginBottom: 10}}>Planner</div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create">Create Trip</Link>
        <Link to="/destination-explorer">Explore Cities</Link>
        <Link to="/community">Community</Link>
        <Link to="/profile">My Profile</Link>
      </nav>
    </aside>
  )
}

import React from 'react';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';

const user = {
  name: 'Maya',
  email: 'maya@example.com',
  avatar: 'https://i.pravatar.cc/150?img=32',
  homeCity: 'New York, USA',
  preferences: {
    style: 'Relaxation',
    budget: 'Mid-range',
    notes: 'Loves boutique hotels, local cafes, and museum passes. Prefers morning flights.',
  },
};

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="container section">
        <main style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader title="My Profile" subtitle="Manage your account details and travel preferences." />

          <div className="card glass" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
            <div className="avatar" style={{ width: '80px', height: '80px' }}>
              <img src={user.avatar} alt={user.name} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user.name}</h2>
              <p className="muted" style={{ margin: '4px 0 0 0' }}>
                {user.email} &bull; From {user.homeCity}
              </p>
              <button className="btn btn-ghost" style={{ marginTop: '12px' }}>
                Change Avatar
              </button>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3>Account Details</h3>
              <form style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
                <input className="input" defaultValue={user.name} placeholder="Your Name" />
                <input className="input" defaultValue={user.email} placeholder="Email Address" />
                <input className="input" defaultValue={user.homeCity} placeholder="Home City" />
                <button className="btn btn-primary" type="submit">
                  Save Changes
                </button>
              </form>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3>Travel Preferences</h3>
              <form style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
                <select className="input" defaultValue={user.preferences.style}>
                  <option>Adventure</option>
                  <option>Relaxation</option>
                  <option>Culture</option>
                  <option>Food & Wine</option>
                </select>
                <select className="input" defaultValue={user.preferences.budget}>
                  <option>Budget-friendly</option>
                  <option>Mid-range</option>
                  <option>Luxury</option>
                </select>
                <textarea
                  rows="3"
                  className="input"
                  defaultValue={user.preferences.notes}
                  placeholder="Notes on your travel style..."
                />
                <button className="btn btn-primary" type="submit">
                  Update Preferences
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

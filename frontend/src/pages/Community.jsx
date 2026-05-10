import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { FiCopy, FiThumbsUp, FiMessageCircle } from 'react-icons/fi';

const publicTrips = [
  {
    id: 1,
    title: 'Backpacking Southeast Asia',
    author: 'Alex Traveler',
    destinations: 'Thailand, Vietnam, Cambodia',
    duration: '21 Days',
    likes: 124,
    comments: 18,
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=600'
  },
  {
    id: 2,
    title: 'Weekend in Rome',
    author: 'Sarah Jenkins',
    destinations: 'Rome, Italy',
    duration: '3 Days',
    likes: 89,
    comments: 5,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600'
  },
  {
    id: 3,
    title: 'Patagonia Adventure',
    author: 'Mountain Explorer',
    destinations: 'Chile, Argentina',
    duration: '14 Days',
    likes: 210,
    comments: 42,
    image: 'https://images.unsplash.com/photo-1502693630040-d61ccae415bd?q=80&w=600'
  }
];

export default function Community() {
  const [toastMessage, setToastMessage] = useState('');

  const handleCloneTrip = (tripTitle) => {
    setToastMessage(`Cloned "${tripTitle}" to your account!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div>
      <Navbar />
      <div className="container section" style={{ position: 'relative' }}>
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--primary)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            transition: 'opacity 0.3s'
          }}>
            {toastMessage}
          </div>
        )}

        <main>
          <SectionHeader
            title="Community Shared Trips"
            subtitle="Discover itineraries created by other travelers and clone them for your own adventure."
          />

          <div className="grid-3">
            {publicTrips.map(trip => (
              <div key={trip.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={trip.image} alt={trip.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{trip.title}</h3>
                  <div className="muted" style={{ fontSize: '13px', marginBottom: '8px' }}>By {trip.author}</div>
                  <div style={{ fontSize: '14px', marginBottom: '16px', flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Destinations:</strong> {trip.destinations}</p>
                    <p style={{ margin: 0 }}><strong>Duration:</strong> {trip.duration}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--muted)', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiThumbsUp /> {trip.likes}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiMessageCircle /> {trip.comments}</span>
                    </div>
                    <button 
                      className="btn btn-ghost" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => handleCloneTrip(trip.title)}
                    >
                      <FiCopy /> Clone Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

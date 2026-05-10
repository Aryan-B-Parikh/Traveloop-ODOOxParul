import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import DestinationCard from '../components/destinations/DestinationCard';
import ActivityCard from '../components/itinerary/ActivityCard';
import { sampleDestinations } from '../data/sampleDestinations';
import { sampleActivities } from '../data/sampleActivities';
import { tripService } from '../services/tripService';
import { FiCheck, FiX } from 'react-icons/fi';

const CATEGORIES = ['All', 'Beach', 'Culture', 'Nightlife', 'Adventure'];

export default function DestinationExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal and Toast State
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [trips, setTrips] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  React.useEffect(() => {
    tripService.getTrips().then(setTrips).catch(console.error);
  }, []);

  /* ── Derived State: Filtering ── */
  const lowerQuery = searchQuery.toLowerCase();

  const filteredDestinations = sampleDestinations.filter((dest) => {
    if (!lowerQuery) return true;
    return dest.name.toLowerCase().includes(lowerQuery) || dest.country.toLowerCase().includes(lowerQuery);
  });

  const filteredActivities = sampleActivities.filter((act) => {
    // 1. Filter by category
    if (selectedCategory !== 'All' && act.category !== selectedCategory) {
      return false;
    }
    // 2. Filter by search query (name or city)
    if (lowerQuery && !act.name.toLowerCase().includes(lowerQuery) && !act.city.toLowerCase().includes(lowerQuery)) {
      return false;
    }
    return true;
  });

  /* ── Add to Itinerary Handlers ── */
  const handleAddClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleSelectTrip = (trip) => {
    // We would normally add it to the trip's itinerarySections here.
    // For this prototype, we mock saving it as a saved activity on the trip object.
    const updatedTrip = {
      ...trip,
      savedActivities: trip.savedActivities ? [...trip.savedActivities, selectedActivity] : [selectedActivity]
    };
    saveTrip(updatedTrip);
    
    // Show toast and close modal
    setToastMessage(`Added "${selectedActivity.name}" to ${trip.name}!`);
    setSelectedActivity(null);
    
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  return (
    <>
      <Navbar />
      <div className="container section">
        <SectionHeader title="Destination Explorer" subtitle="Search cities, save activities, and curate your list." />
        
        {/* ── Search & Filter Controls ── */}
        <div className="card glass" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
            <input 
              className="input" 
              placeholder="Search destinations or activities by city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
            <div className="inline-list" style={{ marginTop: '4px' }}>
              <span className="muted" style={{ fontSize: '14px', marginRight: '8px', alignSelf: 'center' }}>Filter:</span>
              {CATEGORIES.map((cat) => (
                <span 
                  key={cat}
                  className={`chip ${selectedCategory === cat ? 'chip-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Destinations List ── */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Top Destinations</h3>
          {filteredDestinations.length === 0 ? (
            <div className="muted" style={{ padding: '20px 0' }}>No destinations match your search.</div>
          ) : (
            <div className="grid-4 fade-up">
              {filteredDestinations.map((item) => (
                <DestinationCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* ── Activities List ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <SectionHeader title="Popular Activities" subtitle="Save experiences to your itinerary." />
          {filteredActivities.length === 0 ? (
            <div className="muted" style={{ padding: '20px 0' }}>No activities match your filters.</div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }} className="fade-up">
              {filteredActivities.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onAdd={handleAddClick} 
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Add to Trip Modal ── */}
      {selectedActivity && (
        <div className="modal-backdrop" onClick={() => setSelectedActivity(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Add to Itinerary</h3>
              <button 
                onClick={() => setSelectedActivity(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
              >
                <FiX size={20} />
              </button>
            </div>
            <p>Select a trip to save <strong>{selectedActivity.name}</strong> to:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {trips.length === 0 ? (
                <div className="muted" style={{ fontSize: '13px', textAlign: 'center', padding: '12px' }}>
                  No active trips found. Go to Dashboard to create one.
                </div>
              ) : (
                trips.map(trip => (
                  <button 
                    key={trip.id}
                    className="card"
                    style={{ 
                      padding: '12px 16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      background: 'white',
                      textAlign: 'left'
                    }}
                    onClick={() => handleSelectTrip(trip)}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{trip.name}</div>
                      <div className="muted" style={{ fontSize: '12px', marginTop: '2px' }}>{trip.dates}</div>
                    </div>
                    <FiCheck className="muted" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Success Toast ── */}
      {toastMessage && (
        <div className="toast toast-success">
          <span className="toast-icon"><FiCheck /></span>
          {toastMessage}
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import { FiPlus, FiTrash } from 'react-icons/fi';

export default function CreateTrip() {
  const [destinations, setDestinations] = useState(['Paris, France']);

  const addDestination = () => setDestinations([...destinations, '']);
  const updateDestination = (index, value) => {
    const next = [...destinations];
    next[index] = value;
    setDestinations(next);
  };
  const removeDestination = (index) => {
    const next = destinations.filter((_, i) => i !== index);
    setDestinations(next);
  };

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main style={{ maxWidth: '720px', margin: '0 auto' }}>
          <SectionHeader
            title="Create a New Trip"
            subtitle="Map out your next adventure with all the essential details."
          />
          <form className="card glass" style={{ padding: '28px', display: 'grid', gap: '20px' }}>
            <div>
              <label className="muted">Trip Name</label>
              <input className="input" placeholder="e.g., Summer in Europe" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="muted">Start Date</label>
                <input className="input" type="date" required />
              </div>
              <div>
                <label className="muted">End Date</label>
                <input className="input" type="date" required />
              </div>
            </div>

            <div>
              <label className="muted">Trip Description</label>
              <textarea rows="3" placeholder="Describe the overall vibe, goals, and priorities for this trip." />
            </div>

            <div>
              <label className="muted">Destinations</label>
              <div style={{ display: 'grid', gap: '12px' }}>
                {destinations.map((value, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      className="input"
                      placeholder={`City, Country ${idx + 1}`}
                      value={value}
                      onChange={(e) => updateDestination(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => removeDestination(idx)}
                      style={{ padding: '10px' }}
                    >
                      <FiTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={addDestination}
              >
                <FiPlus /> Add Destination
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="muted">Budget (USD)</label>
                <input className="input" type="number" placeholder="4000" required />
              </div>
              <div>
                <label className="muted">Cover Image</label>
                <input className="input" type="file" />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ justifySelf: 'start', marginTop: '10px' }}>
              Create & Continue
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

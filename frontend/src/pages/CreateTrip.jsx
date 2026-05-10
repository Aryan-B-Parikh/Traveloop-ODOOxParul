import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { formatDateRange } from '../data/tripStore';
import * as tripService from '../services/tripService';
import { FiPlus, FiTrash, FiCheck, FiLoader } from 'react-icons/fi';

export default function CreateTrip() {
  const navigate = useNavigate();

  /* ── Form state ── */
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [destinations, setDestinations] = useState(['']);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* ── Destination list management ── */
  const addDestination = () => setDestinations([...destinations, '']);
  const updateDestination = (index, value) => {
    const next = [...destinations];
    next[index] = value;
    setDestinations(next);
  };
  const removeDestination = (index) => {
    if (destinations.length <= 1) return;
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Trip name is required';
    if (!startDate) errs.startDate = 'Start date is required';
    if (!endDate) errs.endDate = 'End date is required';
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errs.endDate = 'End date must be after start date';
    }
    if (!destinations.some((d) => d.trim())) errs.destinations = 'At least one destination is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const tripPayload = {
        startDestination: name.trim(), // Using name as startDestination
        returnPlace: destinations.filter((d) => d.trim()).join(', '),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        description: description.trim(),
        status: 'PLANNED'
      };

      await tripService.createTrip(tripPayload);

      // Show success toast, then redirect
      setToast(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to create trip. Please try again.' });
    } finally {
      setIsSaving(false);
    }
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
          <form
            className="card glass"
            style={{ padding: '28px', display: 'grid', gap: '20px' }}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Trip Name */}
            <div>
              <label className="muted">Trip Name</label>
              <input
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g., Summer in Europe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            {/* Date Range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="muted">Start Date</label>
                <input
                  className={`input ${errors.startDate ? 'input-error' : ''}`}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                {errors.startDate && <div className="field-error">{errors.startDate}</div>}
              </div>
              <div>
                <label className="muted">End Date</label>
                <input
                  className={`input ${errors.endDate ? 'input-error' : ''}`}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                {errors.endDate && <div className="field-error">{errors.endDate}</div>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="muted">Trip Description</label>
              <textarea
                rows="3"
                placeholder="Describe the overall vibe, goals, and priorities for this trip."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Destinations */}
            <div>
              <label className="muted">Destinations</label>
              {errors.destinations && <div className="field-error">{errors.destinations}</div>}
              <div style={{ display: 'grid', gap: '12px', marginTop: '6px' }}>
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
                      disabled={destinations.length <= 1}
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

            {/* Budget + Cover */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="muted">Budget (USD)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="4000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div>
                <label className="muted">Cover Image</label>
                <input className="input" type="file" />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={isSaving} style={{ justifySelf: 'start', marginTop: '10px' }}>
              {isSaving ? <FiLoader className="spin" /> : 'Create & Continue'}
            </button>
            {errors.submit && <div className="field-error">{errors.submit}</div>}
          </form>
        </main>
      </div>

      {/* Success Toast */}
      {toast && (
        <div className="toast toast-success">
          <span className="toast-icon"><FiCheck /></span>
          Trip created! Redirecting to dashboard…
        </div>
      )}
    </div>
  );
}

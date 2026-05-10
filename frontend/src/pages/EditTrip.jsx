import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { getTrip as getLocalTrip, saveTrip as saveLocalTrip, deleteTrip as deleteLocalTrip, formatDateRange } from '../data/tripStore';
import * as tripService from '../services/tripService';
import { FiPlus, FiTrash, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ── Form state ── */
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [destinations, setDestinations] = useState(['']);
  const [status, setStatus] = useState('Draft');
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ── Load trip on mount ── */
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        let trip;
        if (id.startsWith('trip-')) {
          trip = getLocalTrip(id);
        } else {
          trip = await tripService.getTrip(id);
        }

        if (!trip) {
          setNotFound(true);
          return;
        }
        setName(trip.startDestination || trip.name || '');
        setStartDate(trip.startDate ? trip.startDate.split('T')[0] : '');
        setEndDate(trip.endDate ? trip.endDate.split('T')[0] : '');
        setDescription(trip.description || '');
        setBudget(trip.budget ? String(trip.budget) : '');
        setStatus(trip.status || 'Planned');
        setDestinations(
          trip.returnPlace ? trip.returnPlace.split(',').map((d) => d.trim()) : (trip.destination ? trip.destination.split(',').map((d) => d.trim()) : [''])
        );
      } catch (err) {
        console.error(err);
        const local = getLocalTrip(id);
        if (local) {
          setName(local.name || '');
          setStartDate(local.startDate || '');
          setEndDate(local.endDate || '');
          setDestinations(local.destination ? local.destination.split(',').map((d) => d.trim()) : ['']);
        } else {
          setNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

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

  /* ── Submit (update) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (id.startsWith('trip-')) {
        saveLocalTrip({
          id,
          name: name.trim(),
          destination: destinations.filter((d) => d.trim()).join(', '),
          startDate,
          endDate,
          dates: formatDateRange(startDate, endDate),
          description: description.trim(),
          budget: Number(budget) || 0,
          status,
        });
      } else {
         const payload = {
          name: name.trim(),
          startDestination: name.trim(),
          returnPlace: destinations.filter((d) => d.trim()).join(', '),
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          description: description.trim(),
          status: status.toUpperCase(),
        };
        await tripService.updateTrip(id, payload);
      }

      setToast(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Failed to update trip.' });
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      if (id.startsWith('trip-')) {
        deleteLocalTrip(id);
      } else {
        await tripService.deleteTrip(id);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Not found state ── */
  if (notFound) {
    return (
      <div>
        <Navbar />
        <div className="container section">
          <div className="empty-state fade-up">
            <div className="empty-state-icon">
              <FiAlertCircle />
            </div>
            <h3>Trip not found</h3>
            <p>We couldn't find a trip with this ID. It may have been deleted.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main style={{ maxWidth: '720px', margin: '0 auto' }}>
          <SectionHeader
            title="Edit Trip"
            subtitle="Update the details for your adventure."
            action={
              <button
                className="btn btn-danger"
                type="button"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => setShowDeleteModal(true)}
              >
                <FiTrash /> Delete Trip
              </button>
            }
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

            {/* Status */}
            <div>
              <label className="muted">Status</label>
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Draft">Draft</option>
                <option value="Planned">Planned</option>
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
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

            {/* Budget */}
            <div style={{ maxWidth: '340px' }}>
              <label className="muted">Budget (&#8377;)</label>
              <input
                className="input"
                type="number"
                placeholder="4000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={isSaving} style={{ justifySelf: 'start', marginTop: '10px' }}>
              {isSaving ? <FiLoader className="spin" /> : 'Save Changes'}
            </button>
            {errors.submit && <div className="field-error" style={{marginTop: 8}}>{errors.submit}</div>}
          </form>
        </main>
      </div>

      {/* Success Toast */}
      {toast && (
        <div className="toast toast-success">
          <span className="toast-icon"><FiCheck /></span>
          Trip updated! Redirecting…
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this trip?</h3>
            <p>This action cannot be undone. All trip data including itinerary sections and activities will be permanently removed.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <FiTrash style={{ marginRight: '6px' }} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

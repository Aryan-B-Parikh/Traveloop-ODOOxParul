import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { tripService } from '../services/tripService';
import { communityService } from '../services/communityService';
import { FiPlus, FiTrash, FiCheck, FiAlertCircle, FiShare2 } from 'react-icons/fi';

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
  const [status, setStatus] = useState('PLANNED');
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishContent, setPublishContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  /* ── Load trip on mount ── */
  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const trip = await tripService.getTripById(id);
      setName(trip.name || '');
      setStartDate(trip.startDate ? trip.startDate.split('T')[0] : '');
      setEndDate(trip.endDate ? trip.endDate.split('T')[0] : '');
      setDescription(trip.description || '');
      setStatus(trip.status || 'PLANNED');
      // For multi-city, we use startDestination as the primary for now
      setDestinations([trip.startDestination, trip.returnPlace].filter((v, i, a) => v && a.indexOf(v) === i));
    } catch (error) {
      console.error('Failed to fetch trip:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit (update) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const filteredDestinations = destinations.filter((d) => d.trim());
      await tripService.updateTrip(id, {
        name: name.trim(),
        startDestination: filteredDestinations[0] || '',
        returnPlace: filteredDestinations[filteredDestinations.length - 1] || filteredDestinations[0] || '',
        startDate,
        endDate,
        description: description.trim(),
        status,
      });

      setToast(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (error) {
      console.error('Failed to update trip:', error);
      setErrors({ submit: error.message || 'Update failed' });
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      await tripService.deleteTrip(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  /* ── Publish to Community ── */
  const handlePublish = async () => {
    if (!publishContent.trim()) return;
    setPublishing(true);
    try {
      await communityService.createPost(id, publishContent);
      setShowPublishModal(false);
      setPublishContent('');
      setToast(true);
      // Optional: redirect to community
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (error) {
      console.error('Failed to publish trip:', error);
    } finally {
      setPublishing(false);
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
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-ghost"
                  type="button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                  onClick={() => setShowPublishModal(true)}
                >
                  <FiShare2 /> Publish
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FiTrash /> Delete
                </button>
              </div>
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
              <label className="muted">Budget (USD)</label>
              <input
                className="input"
                type="number"
                placeholder="4000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit" style={{ justifySelf: 'start', marginTop: '10px' }}>
              Save Changes
            </button>
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

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="modal-backdrop" onClick={() => setShowPublishModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Publish to Community</h3>
            <p className="muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
              Share your trip with the Traveloop community. Others will be able to see your itinerary and destinations.
            </p>
            <textarea
              className="input"
              rows="4"
              placeholder="What makes this trip special? (e.g., Best street food spots in Tokyo...)"
              value={publishContent}
              onChange={(e) => setPublishContent(e.target.value)}
              style={{ width: '100%', marginBottom: '16px' }}
            />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowPublishModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handlePublish}
                disabled={publishing || !publishContent.trim()}
              >
                {publishing ? 'Publishing...' : 'Share Experience'}
              </button>
            </div>
          </div>
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

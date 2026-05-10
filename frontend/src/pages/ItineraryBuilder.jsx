import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import {
  FiPlus, FiChevronUp, FiChevronDown, FiMapPin, FiCalendar,
  FiDollarSign, FiTrash2, FiEdit2, FiCheck, FiX, FiAlertTriangle,
} from 'react-icons/fi';
import { itineraryService } from '../services/itineraryService';
import { tripService } from '../services/tripService';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, note, children }) {
  return (
    <div className="card glass" style={{ padding: '20px' }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
      {children}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <div className="empty-state fade-up">
      <div className="empty-state-icon">🗺️</div>
      <h3>No itinerary yet</h3>
      <p>Start building your day-by-day travel plan. Add your first destination section to get going!</p>
      <button
        className="btn btn-primary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        onClick={onAdd}
      >
        <FiPlus /> Create First Section
      </button>
    </div>
  );
}

// ── Activity row ──────────────────────────────────────────────────────────────
function ActivityRow({ activity, onMoveUp, onMoveDown, onRemove, isFirst, isLast }) {
  return (
    <div className="card" style={{ padding: '14px' }}>
      <div className="activity-row">
        <div className="activity-info">
          <div className="activity-name">{activity.name}</div>
          <div className="activity-desc">{activity.city} — {activity.description}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div className="tag tag-purple">${activity.cost}</div>
          <div className="activity-actions">
            <button title="Move up" onClick={onMoveUp} disabled={isFirst} style={isFirst ? { opacity: 0.3, cursor: 'default' } : {}}>
              <FiChevronUp />
            </button>
            <button title="Move down" onClick={onMoveDown} disabled={isLast} style={isLast ? { opacity: 0.3, cursor: 'default' } : {}}>
              <FiChevronDown />
            </button>
            <button title="Remove activity" onClick={onRemove}>
              <FiTrash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inline section editor ─────────────────────────────────────────────────────
function SectionEditor({ section, onSave, onCancel }) {
  const [draft, setDraft] = useState({
    location: section.location,
    sectionDateStart: section.sectionDateStart,
    sectionDateEnd: section.sectionDateEnd,
    sectionBudget: section.sectionBudget,
  });

  const set = (key) => (e) =>
    setDraft((prev) => ({
      ...prev,
      [key]: key === 'sectionBudget' ? Number(e.target.value) || 0 : e.target.value,
    }));

  const handleSave = () => {
    if (!draft.location.trim()) return;
    onSave(draft);
  };

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--primary)',
        borderRadius: 12,
        padding: '18px',
        marginTop: 12,
        display: 'grid',
        gap: 12,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Location */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <FiMapPin size={11} style={{ marginRight: 4 }} />Location
          </label>
          <input
            className="input"
            value={draft.location}
            onChange={set('location')}
            placeholder="City, Country"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <FiCalendar size={11} style={{ marginRight: 4 }} />Start Date
          </label>
          <input
            className="input"
            type="date"
            value={draft.sectionDateStart ? new Date(draft.sectionDateStart).toISOString().split('T')[0] : ''}
            onChange={set('sectionDateStart')}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <FiCalendar size={11} style={{ marginRight: 4 }} />End Date
          </label>
          <input
            className="input"
            type="date"
            value={draft.sectionDateEnd ? new Date(draft.sectionDateEnd).toISOString().split('T')[0] : ''}
            onChange={set('sectionDateEnd')}
          />
        </div>

        {/* Budget */}
        <div>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <FiDollarSign size={11} style={{ marginRight: 4 }} />Section Budget ($)
          </label>
          <input
            className="input"
            type="number"
            min={0}
            value={draft.sectionBudget}
            onChange={set('sectionBudget')}
            placeholder="0"
          />
        </div>
      </div>

      {/* Save / Cancel */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={onCancel} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <FiX size={14} /> Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <FiCheck size={14} /> Save Section
        </button>
      </div>
    </div>
  );
}

// ── Delete confirmation banner ────────────────────────────────────────────────
function DeleteConfirm({ section, onConfirm, onCancel }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        marginTop: 10,
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 10,
        fontSize: 13,
        color: '#991b1b',
      }}
    >
      <FiAlertTriangle size={15} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>
        Delete <strong>{section.location}</strong> and all its activities?
      </span>
      <button
        className="btn btn-ghost"
        style={{ fontSize: 13, padding: '6px 12px' }}
        onClick={onCancel}
      >
        Keep
      </button>
      <button
        style={{
          background: '#dc2626',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '6px 14px',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
        }}
        onClick={onConfirm}
      >
        Delete
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (tripId) {
      fetchData();
    }
  }, [tripId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripData, sectionsData] = await Promise.all([
        tripService.getTripById(tripId),
        itineraryService.getSections(tripId)
      ]);
      setTrip(tripData);
      setSections(sectionsData || []);
    } catch (err) {
      console.error('Failed to fetch itinerary:', err);
      setError('Failed to load itinerary. Please ensure the trip exists.');
    } finally {
      setLoading(false);
    }
  };

  /* Derived stats */
  const totalActivities = sections.reduce((sum, s) => sum + (s.activities?.length || 0), 0);
  const totalBudget = sections.reduce((sum, s) => sum + (s.sectionBudget || 0), 0);
  const totalSpent = sections.reduce((sum, s) => (s.activities?.reduce((a, act) => a + (act.cost || 0), 0) || 0) + sum, 0);

  // ── Move activity up/down within a section ──────────────────────────────────
  const moveActivity = (sectionId, idx, dir) => {
    // Reordering logic would need backend support for persistence
    // For now, we'll just update the local state if needed
  };

  // ── Remove activity ─────────────────────────────────────────────────────────
  const removeActivity = async (sectionId, activityId) => {
    // Activity removal would need backend support
  };

  // ── Delete section ────────────────────────────────────
  const handleDeleteSection = async (sectionId) => {
    try {
      await itineraryService.deleteSection(tripId, sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      setDeletingId(null);
    } catch (err) {
      setError('Failed to delete section.');
    }
  };

  // ── Save edited section details ─────────────────────────────────────────────
  const saveSection = async (sectionId, updatedFields) => {
    try {
      await itineraryService.updateSection(tripId, sectionId, updatedFields);
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, ...updatedFields } : s))
      );
      setEditingId(null);
    } catch (err) {
      setError('Failed to save section.');
    }
  };

  // ── Add placeholder section ─────────────────────────────────────────────────
  const addSection = async () => {
    try {
      const newSection = await itineraryService.createSection(tripId, {
        location: 'New Destination',
        sectionDateStart: trip.startDate,
        sectionDateEnd: trip.endDate,
        sectionBudget: 0,
        description: '',
      });
      setSections([...sections, newSection]);
      setEditingId(newSection.id);
    } catch (err) {
      setError('Failed to add section.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          {/* Header */}
          <SectionHeader
            title={`Itinerary: ${trip?.name || 'Loading...'}`}
            subtitle={loading ? "Loading your itinerary..." : "Build your day-by-day travel plan. Edit sections inline and manage activities."}
            action={
              <button
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={addSection}
                disabled={loading}
              >
                <FiPlus /> Add Section
              </button>
            }
          />

          {/* Error banner */}
          {error && (
            <div className="card" style={{ padding: '14px 18px', marginBottom: '18px', background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{error}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#991b1b' }} onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="muted">Loading your itinerary...</div>
            </div>
          ) : sections.length === 0 ? (
            <EmptyState onAdd={addSection} />
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid-3" style={{ marginBottom: '28px' }}>
                <StatCard label="Destinations" value={sections.length} note={`${totalActivities} activities planned`} />
                <StatCard
                  label="Budget Allocated"
                  value={`$${totalBudget.toLocaleString()}`}
                  note={`$${totalSpent.toLocaleString()} activity costs so far`}
                />
                <StatCard label="Budget Remaining" value={`$${(totalBudget - totalSpent).toLocaleString()}`} note="On track">
                  <div className="progress-bar" style={{ marginTop: '10px' }}>
                    <div
                      className="progress-fill"
                      style={{ width: totalBudget > 0 ? `${Math.min((totalSpent / totalBudget) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                </StatCard>
              </div>

              <div className="itinerary-timeline fade-up">
                {sections.map((section, sectionIdx) => (
                  <div key={section.id} className="itinerary-section">
                    <div className="timeline-dot" />
                    <div className="card glass" style={{ padding: '22px' }}>

                      {/* ── Section header row ── */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0 }}>{section.location}</h3>

                        {/* Section controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          {/* Edit section */}
                          <button
                            title={editingId === section.id ? 'Close editor' : 'Edit section'}
                            onClick={() => {
                              setDeletingId(null);
                              setEditingId(editingId === section.id ? null : section.id);
                            }}
                            style={{
                              background: editingId === section.id ? 'var(--primary)' : 'none',
                              color: editingId === section.id ? '#fff' : 'var(--text)',
                              border: '1px solid var(--border)',
                              borderRadius: 7,
                              padding: '5px 7px',
                              cursor: 'pointer',
                              display: 'flex',
                            }}
                          >
                            <FiEdit2 size={14} />
                          </button>

                          {/* Delete section */}
                          <button
                            title="Delete section"
                            onClick={() => {
                              setEditingId(null);
                              setDeletingId(deletingId === section.id ? null : section.id);
                            }}
                            style={{
                              background: 'none',
                              border: '1px solid #fecaca',
                              borderRadius: 7,
                              padding: '5px 7px',
                              cursor: 'pointer',
                              display: 'flex',
                              color: '#dc2626',
                            }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* ── Section meta badges ── */}
                      <div className="section-meta">
                        <span className="section-badge section-badge-date">
                          <FiCalendar size={12} /> {new Date(section.sectionDateStart).toLocaleDateString()} - {new Date(section.sectionDateEnd).toLocaleDateString()}
                        </span>
                        <span className="section-badge section-badge-budget">
                          <FiDollarSign size={12} /> ${section.sectionBudget?.toLocaleString() || 0}
                        </span>
                        <span className="section-badge section-badge-count">
                          <FiMapPin size={12} /> {section.activities?.length || 0} stops
                        </span>
                      </div>

                      {/* ── Inline editor ── */}
                      {editingId === section.id && (
                        <SectionEditor
                          section={section}
                          onSave={(fields) => saveSection(section.id, fields)}
                          onCancel={() => setEditingId(null)}
                        />
                      )}

                      {/* ── Delete confirmation ── */}
                      {deletingId === section.id && (
                        <DeleteConfirm
                          section={section}
                          onConfirm={() => handleDeleteSection(section.id)}
                          onCancel={() => setDeletingId(null)}
                        />
                      )}

                      {/* ── Activities list ── */}
                      {(!section.activities || section.activities.length === 0) ? (
                        <div className="muted" style={{ fontSize: '13px', padding: '18px 0 4px', textAlign: 'center' }}>
                          No activities yet for this section.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '10px', marginTop: '14px' }}>
                          {section.activities.map((activity, idx) => (
                            <ActivityRow
                              key={activity.id}
                              activity={activity}
                              isFirst={idx === 0}
                              isLast={idx === section.activities.length - 1}
                              onMoveUp={() => moveActivity(section.id, idx, -1)}
                              onMoveDown={() => moveActivity(section.id, idx, 1)}
                              onRemove={() => removeActivity(section.id, activity.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

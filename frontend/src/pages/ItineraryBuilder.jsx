import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import StatCard from '../components/ui/StatCard';
import {
  FiPlus, FiChevronUp, FiChevronDown, FiMapPin, FiCalendar,
  FiDollarSign, FiTrash2, FiEdit2, FiCheck, FiX, FiAlertTriangle, FiArrowLeft
} from 'react-icons/fi';
import { itineraryService } from '../services/itineraryService';
import { tripService } from '../services/tripService';
import { sampleActivities } from '../data/sampleActivities';

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'N/A';
  }
};

const formatISO = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

const parseCost = (cost) => {
  if (typeof cost === 'number') return cost;
  if (!cost) return 0;
  const val = Number(String(cost).replace(/[^0-9.-]+/g, ""));
  return isNaN(val) ? 0 : val;
};

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd, tripName }) {
  return (
    <div className="empty-state fade-up">
      <div className="empty-state-icon">🗺️</div>
      <h3>No itinerary for {tripName}</h3>
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

// ── No Trip Selected ──────────────────────────────────────────────────────────
function NoTripSelected() {
  return (
    <div className="empty-state fade-up">
      <div className="empty-state-icon">✈️</div>
      <h3>No Trip Selected</h3>
      <p>Please select a trip from your dashboard to view or build its itinerary.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <FiArrowLeft /> Back to Dashboard
      </Link>
    </div>
  );
}

// ── Activity row ──────────────────────────────────────────────────────────────
function ActivityRow({ activity, onMoveUp, onMoveDown, onRemove, isFirst, isLast }) {
  return (
    <div className="card subtle-glass" style={{ padding: '14px', borderLeft: '4px solid var(--purple)' }}>
      <div className="activity-row">
        <div className="activity-info">
          <div className="activity-name">{activity.name}</div>
          <div className="activity-desc">
            <FiMapPin size={11} style={{ marginRight: 4 }} />
            {activity.city} — {activity.description}
          </div>
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
    location: section.location || '',
    sectionDateStart: section.sectionDateStart || '',
    sectionDateEnd: section.sectionDateEnd || '',
    sectionBudget: section.sectionBudget || 0,
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
      className="fade-up"
      style={{
        background: 'var(--primary-light)',
        border: '1px solid var(--primary)',
        borderRadius: 12,
        padding: '18px',
        marginTop: 12,
        display: 'grid',
        gap: 12,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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

        <div>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <FiCalendar size={11} style={{ marginRight: 4 }} />Start Date
          </label>
          <input
            className="input"
            type="date"
            value={formatISO(draft.sectionDateStart)}
            onChange={set('sectionDateStart')}
          />
        </div>

        <div>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <FiCalendar size={11} style={{ marginRight: 4 }} />End Date
          </label>
          <input
            className="input"
            type="date"
            value={formatISO(draft.sectionDateEnd)}
            onChange={set('sectionDateEnd')}
          />
        </div>

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

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={onCancel} style={{ padding: '8px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <FiX size={14} /> Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} style={{ padding: '8px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
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
        style={{ fontSize: 13, padding: '6px 12px', background: 'white' }}
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

  const fetchData = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }
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
  }, [tripId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Derived stats */
  const totalActivities = sections.reduce((sum, s) => sum + (s.activities?.length || 0), 0);
  const totalBudget = sections.reduce((sum, s) => sum + (s.sectionBudget || 0), 0);
  const totalSpent = sections.reduce((sum, s) => (s.activities?.reduce((a, act) => a + parseCost(act.cost), 0) || 0) + sum, 0);

  const moveActivity = (sectionId, idx, dir) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newActivities = [...(s.activities || [])];
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= newActivities.length) return s;
      
      const temp = newActivities[idx];
      newActivities[idx] = newActivities[targetIdx];
      newActivities[targetIdx] = temp;
      return { ...s, activities: newActivities };
    }));
  };

  const removeActivity = async (sectionId, activityId) => {
    try {
      await itineraryService.deleteActivity(tripId, sectionId, activityId);
      setSections(prev => prev.map(s => {
        if (s.id !== sectionId) return s;
        return { ...s, activities: s.activities.filter(a => a.id !== activityId) };
      }));
    } catch (err) {
      setError('Failed to remove activity.');
    }
  };

  const addRandomActivity = async (sectionId) => {
    try {
      const randomBase = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
      const newActivityData = {
        name: randomBase.name,
        city: randomBase.city,
        description: randomBase.description,
        cost: parseCost(randomBase.cost),
        category: randomBase.category,
        duration: randomBase.tags[0] || '2 hrs'
      };
      
      const savedActivity = await itineraryService.createActivity(tripId, sectionId, newActivityData);
      setSections(prev => prev.map(s => {
        if (s.id !== sectionId) return s;
        return { ...s, activities: [...(s.activities || []), savedActivity] };
      }));
    } catch (err) {
      setError('Failed to add activity.');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await itineraryService.deleteSection(tripId, sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      setDeletingId(null);
    } catch (err) {
      setError('Failed to delete section.');
    }
  };

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

  const addSection = async () => {
    try {
      const newSection = await itineraryService.createSection(tripId, {
        location: 'New Destination',
        sectionDateStart: trip?.startDate || new Date().toISOString(),
        sectionDateEnd: trip?.endDate || new Date().toISOString(),
        sectionBudget: 0,
        description: '',
      });
      setSections([...sections, newSection]);
      setEditingId(newSection.id);
    } catch (err) {
      setError('Failed to add section.');
    }
  };

  if (!tripId) {
    return (
      <div>
        <Navbar />
        <div className="container section">
          <NoTripSelected />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          {/* Header */}
          <SectionHeader
            title={loading ? 'Loading...' : `Itinerary: ${trip?.name || 'Unknown Trip'}`}
            subtitle={loading ? "Fetching your travel plans..." : "Build your day-by-day travel plan. Edit sections inline and manage activities."}
            action={
              <button
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={addSection}
                disabled={loading || !trip}
              >
                <FiPlus /> Add Section
              </button>
            }
          />

          {error && (
            <div className="card" style={{ padding: '14px 18px', marginBottom: '18px', background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{error}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#991b1b' }} onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ marginBottom: 12 }}></div>
              <div className="muted">Loading your itinerary...</div>
            </div>
          ) : sections.length === 0 ? (
            <EmptyState onAdd={addSection} tripName={trip?.name} />
          ) : (
            <div className="layout-asymmetric">
              {/* Main content: Timeline */}
              <div className="itinerary-timeline fade-up">
                {sections.map((section) => (
                  <div key={section.id} className="itinerary-section">
                    <div className="timeline-dot" />
                    <div className="card glass" style={{ padding: '22px' }}>

                      {/* Section header row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0 }}>{section.location}</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          <button
                            title={editingId === section.id ? 'Close editor' : 'Edit section'}
                            onClick={() => {
                              setDeletingId(null);
                              setEditingId(editingId === section.id ? null : section.id);
                            }}
                            className="btn-ghost"
                            style={{
                              background: editingId === section.id ? 'var(--primary)' : 'white',
                              color: editingId === section.id ? '#fff' : 'var(--text)',
                              padding: '5px 8px',
                              borderRadius: 8,
                              display: 'flex',
                            }}
                          >
                            <FiEdit2 size={14} />
                          </button>

                          <button
                            title="Delete section"
                            onClick={() => {
                              setEditingId(null);
                              setDeletingId(deletingId === section.id ? null : section.id);
                            }}
                            className="btn-ghost"
                            style={{
                              padding: '5px 8px',
                              borderRadius: 8,
                              display: 'flex',
                              color: '#dc2626',
                              borderColor: '#fecaca',
                              background: 'white'
                            }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Section meta badges */}
                      <div className="section-meta">
                        <span className="section-badge section-badge-date">
                          <FiCalendar size={12} /> {formatDate(section.sectionDateStart)} - {formatDate(section.sectionDateEnd)}
                        </span>
                        <span className="section-badge section-badge-budget">
                          <FiDollarSign size={12} /> ${section.sectionBudget?.toLocaleString() || 0}
                        </span>
                        <span className="section-badge section-badge-count">
                          <FiMapPin size={12} /> {section.activities?.length || 0} stops
                        </span>
                      </div>

                      {/* Inline editor */}
                      {editingId === section.id && (
                        <SectionEditor
                          section={section}
                          onSave={(fields) => saveSection(section.id, fields)}
                          onCancel={() => setEditingId(null)}
                        />
                      )}

                      {/* Delete confirmation */}
                      {deletingId === section.id && (
                        <DeleteConfirm
                          section={section}
                          onConfirm={() => handleDeleteSection(section.id)}
                          onCancel={() => setDeletingId(null)}
                        />
                      )}

                      {/* Activities list */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px' }}>Activities</h4>
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => addRandomActivity(section.id)}
                        >
                          <FiPlus size={13} /> Add Activity
                        </button>
                      </div>

                      {(!section.activities || section.activities.length === 0) ? (
                        <div className="muted" style={{ fontSize: '13px', padding: '10px 0', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: 8 }}>
                          No activities yet for this section.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '10px' }}>
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

              {/* Sidebar: Stats */}
              <aside>
                <div style={{ display: 'grid', gap: '20px', position: 'sticky', top: '24px' }}>
                  <div className="card glass" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Itinerary Overview</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <StatCard label="Total Sections" value={String(sections.length)} hint="Mapped destinations" />
                      <StatCard label="Activities" value={String(totalActivities)} hint="Scheduled stops" />
                      <StatCard 
                        label="Allocated Budget" 
                        value={`$${totalBudget.toLocaleString()}`} 
                        hint={`$${totalSpent.toLocaleString()} spent on activities`}
                      />
                    </div>
                    
                    <div style={{ marginTop: '20px' }}>
                      <div className="muted" style={{ fontSize: '12px', marginBottom: '6px' }}>Budget Usage</div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: totalBudget > 0 ? `${Math.min((totalSpent / totalBudget) * 100, 100)}%` : '0%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card subtle-glass" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '8px' }}>
                        <FiCalendar color="var(--primary)" />
                      </div>
                      <div style={{ fontWeight: 600 }}>Trip Dates</div>
                    </div>
                    <div className="muted" style={{ fontSize: '13px' }}>
                      {formatDate(trip?.startDate)} — {formatDate(trip?.endDate)}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

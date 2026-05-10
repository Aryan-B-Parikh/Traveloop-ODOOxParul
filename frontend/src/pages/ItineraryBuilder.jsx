import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { itinerarySections, tripMeta } from '../data/sampleItinerary';
import {
  FiPlus, FiChevronUp, FiChevronDown, FiMapPin, FiCalendar,
  FiDollarSign, FiTrash2, FiEdit2, FiCheck, FiX, FiAlertTriangle,
} from 'react-icons/fi';
import * as itineraryService from '../services/itineraryService';

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
          <div className="tag tag-purple">₹{activity.cost}</div>
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
    dateRange: section.dateRange,
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

        {/* Date range */}
        <div>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <FiCalendar size={11} style={{ marginRight: 4 }} />Date Range
          </label>
          <input
            className="input"
            value={draft.dateRange}
            onChange={set('dateRange')}
            placeholder="e.g. Jun 14 – Jun 16"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
            <span style={{ marginRight: 4 }}>₹</span>Section Budget (₹)
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
  const [sections, setSections] = useState([]); // Default empty, wait for fetch
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);       // section being edited
  const [deletingId, setDeletingId] = useState(null);     // section pending delete confirm

  // TODO: Get tripId from URL params once Trip Detail View is ready
  const { tripId: routeTripId } = useParams();
  const tripId = routeTripId || 1; 

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await itineraryService.getSections(tripId);
        setSections(data || []);
      } catch (err) {
        console.error(err);
        // Fallback to sample data if backend fails or trip 1 doesn't exist
        setSections(itinerarySections);
        setError('Failed to load itinerary sections from server. Showing local preview.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSections();
  }, [tripId]);

  /* Derived stats */
  const totalActivities = sections.reduce((sum, s) => sum + s.activities.length, 0);
  const totalBudget     = sections.reduce((sum, s) => sum + s.sectionBudget, 0);
  const totalSpent      = sections.reduce((sum, s) => s.activities.reduce((a, act) => a + act.cost, 0) + sum, 0);

  // ── Move activity up/down within a section ──────────────────────────────────
  const moveActivity = (sectionId, idx, dir) => {
    try {
      setSections((prev) =>
        prev.map((sec) => {
          if (sec.sectionId !== sectionId) return sec;
          const arr = [...sec.activities];
          const target = idx + dir;
          if (target < 0 || target >= arr.length) return sec;
          [arr[idx], arr[target]] = [arr[target], arr[idx]];
          return { ...sec, activities: arr };
        })
      );
    } catch {
      setError('Failed to reorder activity. Please try again.');
    }
  };

  // ── Remove activity ─────────────────────────────────────────────────────────
  const removeActivity = (sectionId, activityId) => {
    try {
      setSections((prev) =>
        prev.map((sec) =>
          sec.sectionId !== sectionId
            ? sec
            : { ...sec, activities: sec.activities.filter((a) => a.activityId !== activityId) }
        )
      );
    } catch {
      setError('Failed to remove activity.');
    }
  };

  // ── Move section up/down ────────────────────────────────────────────────────
  const moveSection = (idx, dir) => {
    try {
      const target = idx + dir;
      if (target < 0 || target >= sections.length) return;
      setSections((prev) => {
        const arr = [...prev];
        [arr[idx], arr[target]] = [arr[target], arr[idx]];
        return arr;
      });
    } catch {
      setError('Failed to reorder section.');
    }
  };

  // ── Delete section (after confirmation) ────────────────────────────────────
  const deleteSection = async (sectionId) => {
    try {
      // Mock section IDs start with 's' and don't exist in backend
      if (!String(sectionId).startsWith('s')) {
        await itineraryService.deleteSection(tripId, sectionId);
      }
      setSections((prev) => prev.filter((s) => s.sectionId !== sectionId));
      setDeletingId(null);
      if (editingId === sectionId) setEditingId(null);
    } catch {
      setError('Failed to delete section from server.');
    }
  };

  // ── Save edited section details ─────────────────────────────────────────────
  const saveSection = async (sectionId, updatedFields) => {
    try {
      if (!String(sectionId).startsWith('s')) {
        await itineraryService.updateSection(tripId, sectionId, updatedFields);
      }
      setSections((prev) =>
        prev.map((s) => (s.sectionId === sectionId ? { ...s, ...updatedFields } : s))
      );
      setEditingId(null);
    } catch {
      setError('Failed to save section to server.');
    }
  };

  // ── Add placeholder section ─────────────────────────────────────────────────
  const addSection = async () => {
    try {
      const newSectionData = {
        dateRange: 'Set dates',
        location: 'New Destination',
        sectionBudget: 0,
      };
      
      // Try hitting API
      let newSection;
      try {
        newSection = await itineraryService.createSection(tripId, newSectionData);
        newSection.activities = []; // API might return empty or omit activities array
      } catch (err) {
        console.error('API failed, using local mock ID:', err.message);
        // Fallback if backend isn't running or trip doesn't exist
        newSection = {
          sectionId: `s${Date.now()}`,
          tripId: tripId,
          ...newSectionData,
          activities: [],
        };
      }

      setSections((prev) => [...prev, newSection]);
      setEditingId(newSection.sectionId);
    } catch {
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
            title={`Itinerary: ${tripMeta.name}`}
            subtitle={isLoading ? "Loading your itinerary..." : "Build your day-by-day travel plan. Edit sections inline, reorder stops, and manage activities."}
            action={
              <button
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={addSection}
              >
                <FiPlus /> Add Section
              </button>
            }
          />

          {/* Error banner */}
          {error && (
            <div
              className="card"
              style={{
                padding: '14px 18px',
                marginBottom: '18px',
                background: '#fef2f2',
                borderColor: '#fecaca',
                color: '#991b1b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{error}</span>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#991b1b' }}
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Summary stats */}
          <div className="grid-3" style={{ marginBottom: '28px' }}>
            <StatCard label="Destinations" value={sections.length} note={`${totalActivities} activities planned`} />
            <StatCard
              label="Budget Allocated"
              value={`₹${totalBudget.toLocaleString()}`}
              note={`₹${totalSpent.toLocaleString()} activity costs so far`}
            />
            <StatCard label="Budget Remaining" value={`₹${(totalBudget - totalSpent).toLocaleString()}`} note="On track">
              <div className="progress-bar" style={{ marginTop: '10px' }}>
                <div
                  className="progress-fill"
                  style={{ width: totalBudget > 0 ? `${Math.min((totalSpent / totalBudget) * 100, 100)}%` : '0%' }}
                />
              </div>
            </StatCard>
          </div>

          {/* Empty or timeline */}
          {sections.length === 0 ? (
            <EmptyState onAdd={addSection} />
          ) : (
            <div className="itinerary-timeline fade-up">
              {sections.map((section, sectionIdx) => (
                <div key={section.sectionId} className="itinerary-section">
                  <div className="timeline-dot" />
                  <div className="card glass" style={{ padding: '22px' }}>

                    {/* ── Section header row ── */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h3 style={{ margin: 0 }}>{section.location}</h3>

                      {/* Section controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        {/* Move section up */}
                        <button
                          title="Move section up"
                          onClick={() => moveSection(sectionIdx, -1)}
                          disabled={sectionIdx === 0}
                          style={{
                            background: 'none',
                            border: '1px solid var(--border)',
                            borderRadius: 7,
                            padding: '5px 7px',
                            cursor: sectionIdx === 0 ? 'default' : 'pointer',
                            opacity: sectionIdx === 0 ? 0.3 : 1,
                            display: 'flex',
                            color: 'var(--text)',
                          }}
                        >
                          <FiChevronUp size={14} />
                        </button>

                        {/* Move section down */}
                        <button
                          title="Move section down"
                          onClick={() => moveSection(sectionIdx, 1)}
                          disabled={sectionIdx === sections.length - 1}
                          style={{
                            background: 'none',
                            border: '1px solid var(--border)',
                            borderRadius: 7,
                            padding: '5px 7px',
                            cursor: sectionIdx === sections.length - 1 ? 'default' : 'pointer',
                            opacity: sectionIdx === sections.length - 1 ? 0.3 : 1,
                            display: 'flex',
                            color: 'var(--text)',
                          }}
                        >
                          <FiChevronDown size={14} />
                        </button>

                        {/* Edit section */}
                        <button
                          title={editingId === section.sectionId ? 'Close editor' : 'Edit section'}
                          onClick={() => {
                            setDeletingId(null);
                            setEditingId(editingId === section.sectionId ? null : section.sectionId);
                          }}
                          style={{
                            background: editingId === section.sectionId ? 'var(--primary)' : 'none',
                            color: editingId === section.sectionId ? '#fff' : 'var(--text)',
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
                            setDeletingId(deletingId === section.sectionId ? null : section.sectionId);
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
                        <FiCalendar size={12} /> {section.dateRange}
                      </span>
                      <span className="section-badge section-badge-budget">
                        <span style={{ marginRight: 4 }}>₹</span> {section.sectionBudget.toLocaleString()}
                      </span>
                      <span className="section-badge section-badge-count">
                        <FiMapPin size={12} /> {section.activities.length} stops
                      </span>
                    </div>

                    {/* ── Inline editor ── */}
                    {editingId === section.sectionId && (
                      <SectionEditor
                        section={section}
                        onSave={(fields) => saveSection(section.sectionId, fields)}
                        onCancel={() => setEditingId(null)}
                      />
                    )}

                    {/* ── Delete confirmation ── */}
                    {deletingId === section.sectionId && (
                      <DeleteConfirm
                        section={section}
                        onConfirm={() => deleteSection(section.sectionId)}
                        onCancel={() => setDeletingId(null)}
                      />
                    )}

                    {/* ── Activities list ── */}
                    {section.activities.length === 0 ? (
                      <div className="muted" style={{ fontSize: '13px', padding: '18px 0 4px', textAlign: 'center' }}>
                        No activities yet — use the edit panel to fill in details, or add activities from the Explorer.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px', marginTop: '14px' }}>
                        {section.activities.map((activity, idx) => (
                          <ActivityRow
                            key={activity.activityId}
                            activity={activity}
                            isFirst={idx === 0}
                            isLast={idx === section.activities.length - 1}
                            onMoveUp={() => moveActivity(section.sectionId, idx, -1)}
                            onMoveDown={() => moveActivity(section.sectionId, idx, 1)}
                            onRemove={() => removeActivity(section.sectionId, activity.activityId)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

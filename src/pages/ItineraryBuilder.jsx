import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import { itinerarySections, tripMeta } from '../data/sampleItinerary';
import { FiPlus, FiChevronUp, FiChevronDown, FiMapPin, FiCalendar, FiDollarSign, FiTrash2 } from 'react-icons/fi';

/* ── Stat card matching BudgetCard pattern ── */
function StatCard({ label, value, note }) {
  return (
    <div className="card glass" style={{ padding: '20px' }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

/* ── Empty state shown when no sections exist ── */
function EmptyState({ onAdd }) {
  return (
    <div className="empty-state fade-up">
      <div className="empty-state-icon">🗺️</div>
      <h3>No itinerary yet</h3>
      <p>Start building your day-by-day travel plan. Add your first destination section to get going!</p>
      <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={onAdd}>
        <FiPlus /> Create First Section
      </button>
    </div>
  );
}

/* ── Single activity row inside a section card ── */
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
            <button title="Remove" onClick={onRemove}>
              <FiTrash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page component ── */
export default function ItineraryBuilder() {
  const [sections, setSections] = useState(itinerarySections);
  const [error, setError] = useState(null);

  /* Derived stats */
  const totalActivities = sections.reduce((sum, s) => sum + s.activities.length, 0);
  const totalBudget = sections.reduce((sum, s) => sum + s.sectionBudget, 0);
  const totalSpent = sections.reduce((sum, s) => s.activities.reduce((a, act) => a + act.cost, 0) + sum, 0);

  /* ── Reorder: move activity up/down within a section ── */
  const moveActivity = (sectionId, activityIndex, direction) => {
    try {
      setSections((prev) =>
        prev.map((section) => {
          if (section.sectionId !== sectionId) return section;
          const updated = [...section.activities];
          const targetIndex = activityIndex + direction;
          if (targetIndex < 0 || targetIndex >= updated.length) return section;
          [updated[activityIndex], updated[targetIndex]] = [updated[targetIndex], updated[activityIndex]];
          return { ...section, activities: updated };
        })
      );
    } catch (err) {
      setError('Failed to reorder activity. Please try again.');
    }
  };

  /* ── Remove activity ── */
  const removeActivity = (sectionId, activityId) => {
    try {
      setSections((prev) =>
        prev.map((section) => {
          if (section.sectionId !== sectionId) return section;
          return { ...section, activities: section.activities.filter((a) => a.activityId !== activityId) };
        })
      );
    } catch (err) {
      setError('Failed to remove activity.');
    }
  };

  /* ── Add a placeholder section ── */
  const addSection = () => {
    const newId = `s${Date.now()}`;
    setSections((prev) => [
      ...prev,
      {
        sectionId: newId,
        tripId: tripMeta.tripId,
        dateRange: 'Set dates',
        location: 'New Destination',
        sectionBudget: 0,
        activities: [],
      },
    ]);
  };

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          {/* ── Header ── */}
          <SectionHeader
            title={`Itinerary: ${tripMeta.name}`}
            subtitle="Build your day-by-day travel plan with destinations, activities, and budgets."
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

          {/* ── Error Banner ── */}
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

          {/* ── Summary Stat Cards ── */}
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

          {/* ── Empty state or Timeline ── */}
          {sections.length === 0 ? (
            <EmptyState onAdd={addSection} />
          ) : (
            <div className="itinerary-timeline fade-up">
              {sections.map((section) => (
                <div key={section.sectionId} className="itinerary-section">
                  <div className="timeline-dot" />
                  <div className="card glass" style={{ padding: '22px' }}>
                    {/* Section header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h3 style={{ margin: 0 }}>{section.location}</h3>
                    </div>
                    <div className="section-meta">
                      <span className="section-badge section-badge-date">
                        <FiCalendar size={12} /> {section.dateRange}
                      </span>
                      <span className="section-badge section-badge-budget">
                        <FiDollarSign size={12} /> ${section.sectionBudget.toLocaleString()}
                      </span>
                      <span className="section-badge section-badge-count">
                        <FiMapPin size={12} /> {section.activities.length} stops
                      </span>
                    </div>

                    {/* Activities list */}
                    {section.activities.length === 0 ? (
                      <div className="muted" style={{ fontSize: '13px', padding: '18px 0 4px', textAlign: 'center' }}>
                        No activities yet — tap <strong>Add Section</strong> or drag activities here.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '10px', marginTop: '4px' }}>
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

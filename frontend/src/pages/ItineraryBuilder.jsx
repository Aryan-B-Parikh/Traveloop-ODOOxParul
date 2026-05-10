import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { itineraryService } from '../services/itineraryService';
import { tripService } from '../services/tripService';
import { FiPlus, FiChevronUp, FiChevronDown, FiMapPin, FiCalendar, FiDollarSign, FiTrash2 } from 'react-icons/fi';

/* ── Stat card matching BudgetCard pattern ── */
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

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setSections(sectionsData);
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
      setError('Failed to load itinerary. Please ensure the trip exists.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Add a section ── */
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
    } catch (err) {
      setError('Failed to create section.');
    }
  };

  /* ── Remove section ── */
  const removeSection = async (sectionId) => {
    try {
      await itineraryService.deleteSection(tripId, sectionId);
      setSections(sections.filter(s => s.id !== sectionId));
    } catch (err) {
      setError('Failed to remove section.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          {/* ── Header ── */}
          <SectionHeader
            title={`Itinerary: ${trip?.name || 'Loading...'}`}
            subtitle="Build your day-by-day travel plan with destinations, activities, and budgets."
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

          {/* ── Error Banner ── */}
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

              <div className="itinerary-timeline fade-up">
                {sections.map((section) => (
                  <div key={section.id} className="itinerary-section">
                    <div className="timeline-dot" />
                    <div className="card glass" style={{ padding: '22px' }}>
                      {/* Section header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0 }}>{section.location}</h3>
                        <button 
                          className="btn btn-ghost" 
                          style={{ color: 'var(--danger)', padding: '6px' }}
                          onClick={() => removeSection(section.id)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
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

                      {/* Activities list */}
                      {(!section.activities || section.activities.length === 0) ? (
                        <div className="muted" style={{ fontSize: '13px', padding: '18px 0 4px', textAlign: 'center' }}>
                          No activities yet for this section.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '10px', marginTop: '4px' }}>
                          {section.activities.map((activity, idx) => (
                            <ActivityRow
                              key={activity.id}
                              activity={activity}
                              isFirst={idx === 0}
                              isLast={idx === section.activities.length - 1}
                              onMoveUp={() => {}} // Reorder logic would need backend support
                              onMoveDown={() => {}}
                              onRemove={() => {}} // Activity removal would need backend support
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

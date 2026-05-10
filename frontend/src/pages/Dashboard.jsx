import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import TripCard from '../components/trips/TripCard';
import StatCard from '../components/ui/StatCard';
import { getTrips as getLocalTrips, deleteTrip as deleteLocalTrip } from '../data/tripStore';
import * as tripService from '../services/tripService';
import { budgetSummary } from '../data/sampleBudget';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FiPlus } from 'react-icons/fi';

const COLORS = ['#2563eb', '#06b6d4', '#7c3aed', '#38bdf8', '#94a3b8'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getTrips();
        setTrips(data || []);
      } catch (err) {
        console.error(err);
        setTrips(getLocalTrips()); // Fallback to local
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  /* ── Delete flow ── */
  const handleDeleteRequest = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        if (!String(deleteTarget).startsWith('trip-')) {
          await tripService.deleteTrip(deleteTarget);
        } else {
          deleteLocalTrip(deleteTarget);
        }
        setTrips((prev) => prev.filter(t => t.id !== deleteTarget));
        setDeleteTarget(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  /* ── Navigate to edit ── */
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container section">
        <div className="layout-asymmetric">
          <main>
            <SectionHeader
              title="Welcome back, Maya"
              subtitle="Your upcoming adventures and planning insights."
              action={
                <button
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => navigate('/create')}
                >
                  <FiPlus /> Create a new trip
                </button>
              }
            />

            {/* Trip list or empty state */}
            {trips.length === 0 ? (
              <div className="empty-state fade-up">
                <div className="empty-state-icon">✈️</div>
                <h3>No trips yet</h3>
                <p>Create your first trip to start planning your next adventure!</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/create')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <FiPlus /> Create Trip
                </button>
              </div>
            ) : (
              <div className="grid-3">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onEdit={handleEdit}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            )}
          </main>

          <aside>
            <div className="card subtle-glass" style={{ padding: '18px' }}>
              <h3>Budget Breakdown</h3>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetSummary.categories}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      cornerRadius={8}
                    >
                      {budgetSummary.categories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card subtle-glass" style={{ padding: '18px', marginTop: '20px' }}>
              <h3>Quick Stats</h3>
              <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                <StatCard label="Active trips" value={String(trips.length)} hint={trips.length > 0 ? `Next: ${trips[0].startDestination || trips[0].name}` : 'Create one!'} />
                <StatCard
                  label="Total budget"
                  value={`$${budgetSummary.total}`}
                  hint="Across active trips"
                />
                <StatCard
                  label="Spent so far"
                  value={`$${budgetSummary.spent}`}
                  hint="Updated 4 mins ago"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this trip?</h3>
            <p>
              This action cannot be undone. The trip and all its data will be permanently removed.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

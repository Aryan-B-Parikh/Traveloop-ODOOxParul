import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import TripCard from '../components/trips/TripCard';
import StatCard from '../components/ui/StatCard';
import { getTrips as getLocalTrips, deleteTrip as deleteLocalTrip } from '../data/tripStore';
import * as tripService from '../services/tripService';
import * as budgetService from '../services/budgetService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiPlus } from 'react-icons/fi';

const COLORS = ['#2563eb', '#06b6d4', '#7c3aed', '#38bdf8', '#94a3b8'];
const CATEGORY_LABELS = {
  ACCOMMODATION: 'Accommodation',
  TRANSPORTATION: 'Transportation',
  FOOD: 'Food',
  ACTIVITIES: 'Activities',
  SHOPPING: 'Shopping',
  MISCELLANEOUS: 'Miscellaneous',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('ALL');
  const [budgetBreakdown, setBudgetBreakdown] = useState([]);
  const [budgetTotals, setBudgetTotals] = useState({ total: 0, count: 0 });
  const [isBudgetLoading, setIsBudgetLoading] = useState(false);

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

  useEffect(() => {
    const fetchBudgetBreakdown = async () => {
      if (!trips.length) {
        setBudgetBreakdown([]);
        setBudgetTotals({ total: 0, count: 0 });
        return;
      }

      setIsBudgetLoading(true);

      try {
        let aggregatedTotal = 0;
        let aggregatedCount = 0;
        const aggregatedByCategory = {};

        if (selectedTripId === 'ALL') {
          const summaries = await Promise.all(
            trips.map((trip) =>
              budgetService.getExpenseSummary(trip.id).catch(() => ({ total: 0, byCategory: {}, count: 0 }))
            )
          );

          summaries.forEach((summary) => {
            aggregatedTotal += Number(summary?.total || 0);
            aggregatedCount += Number(summary?.count || 0);

            Object.entries(summary?.byCategory || {}).forEach(([category, amount]) => {
              aggregatedByCategory[category] = (aggregatedByCategory[category] || 0) + Number(amount || 0);
            });
          });
        } else {
          const summary = await budgetService.getExpenseSummary(selectedTripId);
          aggregatedTotal = Number(summary?.total || 0);
          aggregatedCount = Number(summary?.count || 0);

          Object.entries(summary?.byCategory || {}).forEach(([category, amount]) => {
            aggregatedByCategory[category] = Number(amount || 0);
          });
        }

        const chartData = Object.entries(aggregatedByCategory)
          .map(([category, value]) => ({
            name: CATEGORY_LABELS[category] || category,
            value,
          }))
          .sort((a, b) => b.value - a.value);

        setBudgetBreakdown(chartData);
        setBudgetTotals({ total: aggregatedTotal, count: aggregatedCount });
      } catch (err) {
        console.error('Failed to load budget breakdown:', err);
        setBudgetBreakdown([]);
        setBudgetTotals({ total: 0, count: 0 });
      } finally {
        setIsBudgetLoading(false);
      }
    };

    fetchBudgetBreakdown();
  }, [selectedTripId, trips]);

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
              title={`Welcome back, ${user?.firstName || 'Traveler'}`}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0 }}>Budget Breakdown</h3>
                <select
                  className="input"
                  style={{ width: '170px' }}
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                >
                  <option value="ALL">All Trips</option>
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name || trip.startDestination || `Trip #${trip.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <p className="muted" style={{ fontSize: '12px' }}>
                {selectedTripId === 'ALL' ? 'Total across all active trips' : 'Selected trip only'}
              </p>
              <div style={{ height: 300 }}>
                {isBudgetLoading ? (
                  <div className="muted" style={{ paddingTop: '40px' }}>Loading budget data...</div>
                ) : budgetBreakdown.length === 0 ? (
                  <div className="muted" style={{ paddingTop: '40px' }}>No expense data yet for this selection.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        cornerRadius={8}
                      >
                        {budgetBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="card subtle-glass" style={{ padding: '18px', marginTop: '20px' }}>
              <h3>Quick Stats</h3>
              <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                <StatCard label="Active trips" value={String(trips.length)} hint={trips.length > 0 ? `Next: ${trips[0].startDestination || trips[0].name}` : 'Create one!'} />
                <StatCard
                  label="Total Expenses"
                  value={<>&#8377;{budgetTotals.total.toLocaleString()}</>}
                  hint={selectedTripId === 'ALL' ? 'Across active trips' : 'Selected trip'}
                />
                <StatCard
                  label="Expense Entries"
                  value={String(budgetTotals.count)}
                  hint="From saved backend data"
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

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import BudgetCard from '../components/budget/BudgetCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FiPlus, FiX } from 'react-icons/fi';
import * as budgetService from '../services/budgetService';
import { getTrip, getTrips } from '../services/tripService';

const COLORS = ['#2563eb', '#06b6d4', '#7c3aed', '#f59e0b', '#10b981', '#ef4444'];

const CATEGORY_OPTIONS = [
  { label: 'Accommodation', value: 'ACCOMMODATION' },
  { label: 'Transportation', value: 'TRANSPORTATION' },
  { label: 'Food', value: 'FOOD' },
  { label: 'Activities', value: 'ACTIVITIES' },
  { label: 'Shopping', value: 'SHOPPING' },
  { label: 'Miscellaneous', value: 'MISCELLANEOUS' },
];

const CATEGORY_LABELS = CATEGORY_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

function formatTripDates(startDate, endDate) {
  if (!startDate || !endDate) return 'Dates not set';

  try {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  } catch {
    return 'Dates not set';
  }
}

export default function BudgetPlanner() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [tripName, setTripName] = useState('Trip Budget');

  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('ACCOMMODATION');

  const { tripId: routeTripId } = useParams();
  const selectedTripId = routeTripId ? String(routeTripId) : '';

  useEffect(() => {
    const fetchBudgetData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tripList = await getTrips();
        setTrips(tripList || []);

        if (!routeTripId) {
          if (!tripList?.length) {
            setTripName('Trip Budget');
            setExpenses([]);
            setError('No trips found. Create a trip first to start budgeting.');
            return;
          }

          navigate(`/budget/${tripList[0].id}`, { replace: true });
          return;
        }

        const activeTripId = String(routeTripId);

        const [trip, expenseList] = await Promise.all([
          getTrip(activeTripId),
          budgetService.getExpenses(activeTripId),
        ]);

        setTripName(trip?.name || 'Trip Budget');
        setExpenses(expenseList || []);
      } catch (err) {
        console.error(err);
        setExpenses([]);
        setError(err?.response?.data?.message || 'Failed to load this trip budget.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData();
  }, [navigate, routeTripId]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      const costVal = Number(curr.totalAmount || 0);
      return acc + (Number.isNaN(costVal) ? 0 : costVal);
    }, 0);
  }, [expenses]);

  const categoryData = useMemo(() => {
    const counts = expenses.reduce((acc, item) => {
      const cat = item.category || 'MISCELLANEOUS';
      const costVal = Number(item.totalAmount || 0);
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += (Number.isNaN(costVal) ? 0 : costVal);
      return acc;
    }, {});

    return Object.keys(counts)
      .map((cat) => ({
        name: CATEGORY_LABELS[cat] || cat,
        value: counts[cat],
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !cost) return;
    if (!selectedTripId) {
      setError('Select a trip before adding expenses.');
      return;
    }

    setError(null);

    try {
      const newExpenseData = {
        description: title,
        category,
        quantity: 1,
        unitCost: Number(cost),
      };

      const newExpense = await budgetService.createExpense(selectedTripId, newExpenseData);
      setExpenses((prev) => [newExpense, ...prev]);

      setShowForm(false);
      setTitle('');
      setCost('');
      setCategory('ACCOMMODATION');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to add expense.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          <SectionHeader
            title={`Budget: ${tripName}`}
            subtitle="Track expenses by category for this trip."
            action={
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => setShowForm((prev) => !prev)}
                  disabled={!selectedTripId}
                >
                  {showForm ? <FiX /> : <FiPlus />} {showForm ? 'Cancel' : 'Add Expense'}
                </button>
              </div>
            }
          />

          {isLoading && <div className="muted" style={{ marginBottom: '16px' }}>Loading budget...</div>}
          {error && <div className="card" style={{ marginBottom: '16px', color: 'var(--danger)' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
            <aside className="card glass" style={{ padding: '16px', alignSelf: 'start' }}>
              <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Select Trip</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {trips.map((trip) => {
                  const isActive = String(trip.id) === selectedTripId;

                  return (
                    <button
                      key={trip.id}
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setShowForm(false);
                        navigate(`/budget/${trip.id}`);
                      }}
                      style={{
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        padding: '10px 12px',
                        border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: isActive ? 'rgba(37, 99, 235, 0.08)' : undefined,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{trip.name || trip.startDestination || `Trip #${trip.id}`}</div>
                        <div className="muted" style={{ fontSize: '12px', marginTop: '3px' }}>
                          {formatTripDates(trip.startDate, trip.endDate)}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {!trips.length && !isLoading && (
                  <div className="muted" style={{ fontSize: '13px' }}>
                    No trips available.
                  </div>
                )}
              </div>
            </aside>

            <section>
              {showForm && (
                <div className="card glass" style={{ padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Add New Expense</h3>
                  <form onSubmit={handleAddExpense} style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label className="muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Description</label>
                        <input
                          className="input"
                          placeholder="e.g., Train to Lyon"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Cost (₹)</label>
                        <input
                          className="input"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g., 45"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Category</label>
                      <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button className="btn btn-primary" type="submit" style={{ justifySelf: 'start', marginTop: '8px' }}>
                      Save Expense
                    </button>
                  </form>
                </div>
              )}

              <div className="grid-3" style={{ marginBottom: '24px' }}>
                <BudgetCard label="Spent So Far" value={<>&#8377;{totalSpent.toLocaleString()}</>} note="This trip" />
                <BudgetCard label="Expense Entries" value={expenses.length} note="Saved to backend" />
                <BudgetCard label="Top Category" value={categoryData[0]?.name || 'N/A'} note="By spend" />
              </div>

              <div className="layout-asymmetric">
                <div className="card glass" style={{ padding: '24px' }}>
                  <h3>Recent Expenses</h3>
                  <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                    {expenses.map((item, idx) => (
                      <div key={item.id || `${item.description}-${idx}`} className="card" style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: 600 }}>{item.description}</div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="tag tag-purple">₹{Number(item.totalAmount || 0).toLocaleString()}</div>
                            <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                              {CATEGORY_LABELS[item.category] || item.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!isLoading && expenses.length === 0 && (
                      <div className="muted">No expenses yet. Add your first cost entry for this trip.</div>
                    )}
                  </div>
                </div>

                <div className="card glass" style={{ padding: '24px' }}>
                  <h3>Spend by Category</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={5}
                          cornerRadius={8}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                        <Legend iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

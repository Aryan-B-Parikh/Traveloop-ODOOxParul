import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import BudgetCard from '../components/budget/BudgetCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { budgetSummary } from '../data/sampleBudget';
import { FiPlus, FiX } from 'react-icons/fi';
import * as budgetService from '../services/budgetService';

const COLORS = ['#2563eb', '#06b6d4', '#7c3aed', '#f59e0b', '#10b981', '#ef4444'];

const initialExpenses = [
  { title: 'Flights to Paris', cost: '$820', category: 'Flights', note: 'Booked via Air France' },
  { title: 'Hotel in Amsterdam', cost: '$560', category: 'Stays', note: '3 nights, canal view' },
  { title: 'Bistro Tasting Menu', cost: '$140', category: 'Food', note: 'Paris, Le Marais' },
  { title: 'Museum Tickets', cost: '$80', category: 'Activities', note: 'Louvre + Rijksmuseum' },
];

export default function BudgetPlanner() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const { tripId: routeTripId } = useParams();
  const tripId = routeTripId || 1; 

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await budgetService.getExpenses(tripId);
        setExpenses(data || []);
      } catch (err) {
        console.error(err);
        setExpenses(initialExpenses);
        setError('Failed to load expenses. Showing preview data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, [tripId]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('Flights');
  const [note, setNote] = useState('');

  // Derived budget calculations
  const totalBudget = 4200; // Hardcoded trip budget for now
  const totalSpent = expenses.reduce((acc, curr) => {
    const costVal = Number(curr.totalAmount || String(curr.cost).replace(/[^0-9.-]+/g,""));
    return acc + (isNaN(costVal) ? 0 : costVal);
  }, 0);
  const remaining = totalBudget - totalSpent;

  // Derived category data for the pie chart
  const categoryData = React.useMemo(() => {
    const counts = expenses.reduce((acc, item) => {
      const cat = item.category || 'OTHER';
      const costVal = Number(item.totalAmount || String(item.cost).replace(/[^0-9.-]+/g,""));
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += (isNaN(costVal) ? 0 : costVal);
      return acc;
    }, {});
    
    return Object.keys(counts).map(cat => ({
      name: cat,
      value: counts[cat]
    }));
  }, [expenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !cost) return;

    // Map frontend category to backend enum if necessary
    let mappedCategory = category.toUpperCase();
    if (mappedCategory === 'STAYS') mappedCategory = 'ACCOMMODATION';

    try {
      const newExpenseData = {
        description: title,
        category: mappedCategory,
        quantity: 1,
        unitCost: Number(cost)
      };

      let newExpense;
      try {
        newExpense = await budgetService.createExpense(tripId, newExpenseData);
      } catch (err) {
        console.error('API failed, using local mock ID:', err.message);
        newExpense = {
          ...newExpenseData,
          id: Date.now(),
          totalAmount: Number(cost),
          title: title, // mock compat
          note: note, // mock compat
          cost: `$${cost}`
        };
      }

      setExpenses([newExpense, ...expenses]);
      setShowForm(false);
      setTitle('');
      setCost('');
      setCategory('Flights');
      setNote('');
    } catch {
      setError('Failed to add expense.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          <SectionHeader
            title="Budget: Summer in Europe"
            subtitle="Track expenses, visualize spending, and stay on budget."
            action={
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-ghost" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => window.print()}
                  title="Export invoice or summary to PDF"
                >
                  Export Invoice
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? <FiX /> : <FiPlus />} {showForm ? 'Cancel' : 'Add Expense'}
                </button>
              </div>
            }
          />

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
                    <label className="muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Cost ($)</label>
                    <input 
                      className="input" 
                      type="number" 
                      placeholder="e.g., 45" 
                      value={cost} 
                      onChange={(e) => setCost(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Category</label>
                    <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>Flights</option>
                      <option>Stays</option>
                      <option>Food</option>
                      <option>Activities</option>
                      <option>Transport</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Note (Optional)</label>
                    <input 
                      className="input" 
                      placeholder="Any extra details" 
                      value={note} 
                      onChange={(e) => setNote(e.target.value)} 
                    />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" style={{ justifySelf: 'start', marginTop: '8px' }}>
                  Save Expense
                </button>
              </form>
            </div>
          )}
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <BudgetCard label="Total Budget" value={`$${totalBudget.toLocaleString()}`} note="For Paris + Amsterdam" />
            <BudgetCard label="Spent So Far" value={`$${totalSpent.toLocaleString()}`} note="Updated today" />
            <BudgetCard label="Remaining" value={`$${remaining.toLocaleString()}`} note="On track" />
          </div>

          <div className="layout-asymmetric">
            <div className="card glass" style={{ padding: '24px' }}>
              <h3>Recent Expenses</h3>
              <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                {expenses.map((item, idx) => (
                  <div key={item.id || `${item.title}-${idx}`} className="card" style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.description || item.title}</div>
                        <div className="muted" style={{ fontSize: '13px' }}>{item.note || ''}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="tag tag-purple">{item.totalAmount ? `$${item.totalAmount}` : item.cost}</div>
                        <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>{item.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import BudgetCard from '../components/BudgetCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { budgetSummary } from '../data/sampleBudget';
import { FiPlus } from 'react-icons/fi';

const COLORS = ['#2563eb', '#06b6d4', '#7c3aed', '#f59e0b', '#10b981', '#ef4444'];

const recentExpenses = [
  { title: 'Flights to Paris', cost: '$820', category: 'Flights', note: 'Booked via Air France' },
  { title: 'Hotel in Amsterdam', cost: '$560', category: 'Stays', note: '3 nights, canal view' },
  { title: 'Bistro Tasting Menu', cost: '$140', category: 'Food', note: 'Paris, Le Marais' },
  { title: 'Museum Tickets', cost: '$80', category: 'Activities', note: 'Louvre + Rijksmuseum' },
];

export default function BudgetPlanner() {
  return (
    <div>
      <Navbar />
      <div className="container section">
        <main>
          <SectionHeader
            title="Budget: Summer in Europe"
            subtitle="Track expenses, visualize spending, and stay on budget."
            action={
              <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FiPlus /> Add Expense
              </button>
            }
          />
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <BudgetCard label="Total Budget" value={`$${budgetSummary.total}`} note="For Paris + Amsterdam" />
            <BudgetCard label="Spent So Far" value={`$${budgetSummary.spent}`} note="Updated today" />
            <BudgetCard label="Remaining" value={`$${budgetSummary.remaining}`} note="On track" />
          </div>

          <div className="layout-asymmetric">
            <div className="card glass" style={{ padding: '24px' }}>
              <h3>Recent Expenses</h3>
              <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                {recentExpenses.map((item) => (
                  <div key={item.title} className="card" style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                        <div className="muted" style={{ fontSize: '13px' }}>{item.note}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="tag tag-purple">{item.cost}</div>
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
                      data={budgetSummary.categories}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      cornerRadius={8}
                    >
                      {budgetSummary.categories.map((_, index) => (
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

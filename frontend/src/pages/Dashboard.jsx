import React from 'react';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import TripCard from '../components/trips/TripCard';
import StatCard from '../components/ui/StatCard';
import { sampleTrips } from '../data/sampleTrips';
import { budgetSummary } from '../data/sampleBudget';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563eb', '#06b6d4', '#7c3aed', '#38bdf8', '#94a3b8'];

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="container section">
        <div className="layout-asymmetric">
          <main>
            <SectionHeader
              title="Welcome back, Maya"
              subtitle="Your upcoming adventures and planning insights."
              action={<button className="btn btn-primary">Create a new trip</button>}
            />
            <div className="grid-3">
              {sampleTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
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
                <StatCard label="Upcoming trips" value="3" hint="Next trip in 12 days" />
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
    </div>
  );
}

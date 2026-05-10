import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { FiUsers, FiMap, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import * as adminService from '../services/adminService';

const initialFlaggedTrips = [
  { id: 101, title: 'Party in Vegas', author: 'WildUser99', flagReason: 'Inappropriate content in description', dateFlagged: '2026-05-09' },
  { id: 102, title: 'Spam Trip Links', author: 'Spammer123', flagReason: 'Contains spam/promotional links', dateFlagged: '2026-05-10' }
];

const initialUsers = [
  { id: 1, name: 'Maya Johnson', email: 'maya@example.com', status: 'Active', joinDate: '2025-11-12' },
  { id: 2, name: 'Alex Traveler', email: 'alex.t@example.com', status: 'Active', joinDate: '2026-01-05' },
  { id: 3, name: 'WildUser99', email: 'wild99@test.com', status: 'Suspended', joinDate: '2026-03-20' },
  { id: 4, name: 'Spammer123', email: 'spam@spam.com', status: 'Active', joinDate: '2026-05-08' }
];

export default function Admin() {
  const [flaggedTrips, setFlaggedTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    activeUsers: 0,
    publicTrips: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData, flaggedData] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getAdminUsers(),
          adminService.getAdminFlaggedTrips()
        ]);
        
        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalTrips: statsData.totalTrips || 0,
          activeUsers: statsData.activeUsers || 0,
          publicTrips: statsData.publicTrips || 0
        });

        setUsers((usersData || []).map(u => ({
          id: u.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
          email: u.email,
          status: 'Active', // Mocked since no backend support
          joinDate: u.createdAt ? u.createdAt.split('T')[0] : ''
        })));

        setFlaggedTrips(flaggedData || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        setStats({ totalUsers: 1245, totalTrips: 8432, activeUsers: 890, publicTrips: 3200 });
        setUsers(initialUsers);
        setFlaggedTrips(initialFlaggedTrips);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveTrip = async (id, title) => {
    await adminService.removeTrip(id);
    setFlaggedTrips(flaggedTrips.filter(trip => trip.id !== id));
    setToastMessage(`Removed flagged trip: "${title}"`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDismissFlag = async (id, title) => {
    await adminService.dismissFlag(id);
    setFlaggedTrips(flaggedTrips.filter(trip => trip.id !== id));
    setToastMessage(`Dismissed flag for: "${title}"`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleUserStatus = async (id, currentStatus, name) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if (newStatus === 'Suspended') {
      await adminService.suspendUser(id);
    } else {
      await adminService.reactivateUser(id);
    }
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    setToastMessage(`${name} has been ${newStatus.toLowerCase()}.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div>
      <Navbar />
      <div className="container section" style={{ position: 'relative' }}>
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--primary)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            transition: 'opacity 0.3s'
          }}>
            {toastMessage}
          </div>
        )}

        <main>
          <SectionHeader
            title="Admin Dashboard"
            subtitle="Manage platform statistics, users, and content moderation."
          />

          <div className="grid-4" style={{ marginBottom: '32px' }}>
            <div className="card glass" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FiUsers size={20} color="var(--primary)" />
                <div className="muted" style={{ fontWeight: 600 }}>Total Users</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.totalUsers.toLocaleString()}</div>
            </div>
            <div className="card glass" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FiUsers size={20} color="#10b981" />
                <div className="muted" style={{ fontWeight: 600 }}>Active Users (30d)</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.activeUsers.toLocaleString()}</div>
            </div>
            <div className="card glass" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FiMap size={20} color="var(--primary)" />
                <div className="muted" style={{ fontWeight: 600 }}>Total Trips</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.totalTrips.toLocaleString()}</div>
            </div>
            <div className="card glass" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FiMap size={20} color="#8b5cf6" />
                <div className="muted" style={{ fontWeight: 600 }}>Public Trips</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{stats.publicTrips.toLocaleString()}</div>
            </div>
          </div>

          <div className="card glass" style={{ padding: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
              <FiAlertTriangle color="#f59e0b" /> Content Moderation: Flagged Trips
            </h3>
            
            {flaggedTrips.length === 0 ? (
              <div className="muted" style={{ padding: '20px 0', textAlign: 'center' }}>
                No flagged trips currently require review.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {flaggedTrips.map(trip => (
                  <div key={trip.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '16px' }}>{trip.title}</div>
                      <div className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                        By {trip.author} • Flagged on {trip.dateFlagged}
                      </div>
                      <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>
                        <strong>Reason:</strong> {trip.flagReason}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-ghost"
                        onClick={() => handleDismissFlag(trip.id, trip.title)}
                      >
                        Dismiss Flag
                      </button>
                      <button 
                        className="btn btn-primary"
                        style={{ background: '#dc2626', borderColor: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => handleRemoveTrip(trip.id, trip.title)}
                      >
                        <FiTrash2 /> Remove Trip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card glass" style={{ padding: '24px', marginTop: '32px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
              <FiUsers color="var(--primary)" /> User Management
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {users.map(user => (
                <div key={user.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {user.name} 
                      <span className={`tag ${user.status === 'Active' ? 'tag-purple' : ''}`} style={{ background: user.status === 'Active' ? '' : '#fee2e2', color: user.status === 'Active' ? '' : '#dc2626' }}>
                        {user.status}
                      </span>
                    </div>
                    <div className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                      {user.email} • Joined on {user.joinDate}
                    </div>
                  </div>
                  <div>
                    <button 
                      className="btn btn-ghost"
                      style={{ 
                        color: user.status === 'Active' ? '#dc2626' : '#10b981',
                        borderColor: user.status === 'Active' ? '#dc2626' : '#10b981'
                      }}
                      onClick={() => handleToggleUserStatus(user.id, user.status, user.name)}
                    >
                      {user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

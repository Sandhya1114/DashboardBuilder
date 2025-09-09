import React from 'react';
import { useSelector } from 'react-redux';
import Klip from './klip';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { klips, loading, error } = useSelector(state => state.dashboard);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error loading dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (klips.length === 0) {
    return (
      <div className="dashboard-empty">
        <div className="empty-state">
          <h3>No Klips Yet</h3>
          <p>Get started by creating your first klip!</p>
          <div className="empty-icon">📊</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {klips.map(klip => (
          <Klip key={klip.id} klip={klip} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
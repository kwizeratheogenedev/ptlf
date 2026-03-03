import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAchievements, getServices, getMessages, getUnreadCount } from 'utils/api';
import AdminLayout from '../../components/AdminLayout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    achievements: 0,
    services: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [achievementsRes, servicesRes, messagesRes, unreadRes] = await Promise.all([
          getAchievements(),
          getServices(),
          getMessages(),
          getUnreadCount()
        ]);

        setStats({
          achievements: achievementsRes.data.length,
          services: servicesRes.data.length,
          messages: messagesRes.data.length,
          unreadMessages: unreadRes.data.count
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="dashboard-page">
        <div className="dashboard-header">
          <p>Welcome to your portfolio management panel</p>
        </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📜</div>
          <div className="stat-content">
            <h3>{stats.achievements}</h3>
            <p>Achievements</p>
          </div>
          <Link to="/admin/achievements" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>{stats.services}</h3>
            <p>Services</p>
          </div>
          <Link to="/admin/services" className="stat-link">Manage →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-content">
            <h3>{stats.messages}</h3>
            <p>Messages</p>
          </div>
          <Link to="/admin/messages" className="stat-link">
            {stats.unreadMessages > 0 ? `View ${stats.unreadMessages} unread →` : 'View all →'}
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>Profile</h3>
            <p>Edit Info</p>
          </div>
          <Link to="/admin/profile" className="stat-link">Edit →</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/achievements" className="action-card">
            <span className="action-icon">+</span>
            <span>Add Achievement</span>
          </Link>
          <Link to="/admin/services" className="action-card">
            <span className="action-icon">+</span>
            <span>Add Service</span>
          </Link>
          <Link to="/admin/messages" className="action-card">
            <span className="action-icon">📬</span>
            <span>Check Messages</span>
          </Link>
          <Link to="/admin/profile" className="action-card">
            <span className="action-icon">⚙️</span>
            <span>Update Profile</span>
          </Link>
        </div>
      </div>

      {/* View Site */}
      <div className="view-site-section">
        <Link to="/" className="btn btn-primary">View Live Portfolio</Link>
      </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUnreadCount } from 'utils/api';
import './AdminLayout.css';

const AdminLayout = ({ children, title }) => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getUnreadCount();
        setUnreadCount(res.data.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    fetchUnread();
  }, []);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/profile', label: 'Profile', icon: '👤' },
    { path: '/admin/achievements', label: 'Achievements', icon: '🏆' },
    { path: '/admin/services', label: 'Services', icon: '💼' },
    { path: '/admin/messages', label: 'Messages', icon: '📬', badge: unreadCount },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🌐</span>
            <span className="nav-label">View Site</span>
          </Link>
          <Link to="/admin/login" className="nav-item" onClick={() => {
            localStorage.removeItem('token');
          }}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
        <header className="admin-header">
          <h1>{title}</h1>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

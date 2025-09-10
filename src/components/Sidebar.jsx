import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  BarChart3, 
  Database, 
  Settings, 
  Users, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toggleSidebar } from '../store/store';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector(state => state.ui);
  const { items: klips } = useSelector(state => state.klips);

  const menuItems = [
    {
      id: 'dashboards',
      label: 'Dashboards',
      icon: LayoutDashboard,
      active: true,
      count: 1
    },
    {
      id: 'widgets',
      label: 'Widgets',
      icon: BarChart3,
      count: klips.length
    },
    {
      id: 'data-sources',
      label: 'Data Sources',
      icon: Database,
      count: 3
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle
    }
  ];

  const recentActivity = [
    { id: 1, type: 'created', item: 'Sales Chart', time: '2 mins ago' },
    { id: 2, type: 'updated', item: 'Revenue Table', time: '5 mins ago' },
    { id: 3, type: 'deleted', item: 'Old Metric', time: '1 hour ago' }
  ];

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <LayoutDashboard size={24} />
          </div>
          {!sidebarCollapsed && (
            <span className="logo-text">Dashboard Builder</span>
          )}
        </div>
        
        <button 
          className="sidebar-toggle"
          onClick={() => dispatch(toggleSidebar())}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="nav-item">
                <a 
                  href={`#${item.id}`}
                  className={`nav-link ${item.active ? 'active' : ''}`}
                >
                  <Icon size={20} className="nav-icon" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="nav-count">{item.count}</span>
                      )}
                    </>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {!sidebarCollapsed && (
        <div className="sidebar-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-dot ${activity.type}`}></div>
                <div className="activity-content">
                  <p className="activity-text">
                    <span className="activity-action">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                    {' '}
                    <span className="activity-item-name">{activity.item}</span>
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-footer">
        {!sidebarCollapsed && (
          <div className="user-info">
            <div className="user-avatar">
              <span>SR</span>
            </div>
            <div className="user-details">
              <p className="user-name">Saloni R.</p>
              <p className="user-role">Dashboard Admin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
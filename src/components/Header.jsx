import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Palette, 
  Settings,
  User,
  ChevronDown,
  Download,
  Share2
} from 'lucide-react';
import { setTheme } from '../store/store';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.ui);
  const { items: klips } = useSelector(state => state.klips);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, color: '#ffffff' },
    { id: 'dark', name: 'Dark', icon: Moon, color: '#0f172a' },
    { id: 'blue', name: 'Ocean', icon: Palette, color: '#eff6ff' },
    { id: 'green', name: 'Forest', icon: Palette, color: '#f0fdf4' },
    { id: 'purple', name: 'Royal', icon: Palette, color: '#faf5ff' }
  ];

  const handleThemeChange = (themeId) => {
    dispatch(setTheme(themeId));
    document.documentElement.setAttribute('data-theme', themeId);
    setShowThemeMenu(false);
  };

  const filteredKlips = klips.filter(klip =>
    klip.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="header">
      <div className="header-left">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search widgets, data, or settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <div className="search-results">
              <div className="search-section">
                <h4>Widgets ({filteredKlips.length})</h4>
                {filteredKlips.slice(0, 5).map(klip => (
                  <div key={klip.id} className="search-result-item">
                    <span className="result-title">{klip.title}</span>
                    <span className="result-type">{klip.type}</span>
                  </div>
                ))}
                {filteredKlips.length > 5 && (
                  <div className="search-more">
                    +{filteredKlips.length - 5} more results
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <button className="header-action-btn" title="Export Dashboard">
            <Download size={18} />
          </button>
          
          <button className="header-action-btn" title="Share Dashboard">
            <Share2 size={18} />
          </button>
          
          <button 
            className="header-action-btn notification-btn" 
            title="Notifications"
          >
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>
        </div>

        <div className="header-divider"></div>

        <div className="theme-selector">
          <button
            className="theme-toggle"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Change Theme"
          >
            <Palette size={18} />
            <ChevronDown size={14} />
          </button>
          
          {showThemeMenu && (
            <div className="theme-menu">
              <div className="theme-menu-header">
                <h3>Choose Theme</h3>
              </div>
              <div className="theme-options">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  return (
                    <button
                      key={themeOption.id}
                      className={`theme-option ${theme === themeOption.id ? 'active' : ''}`}
                      onClick={() => handleThemeChange(themeOption.id)}
                    >
                      <div 
                        className="theme-preview"
                        style={{ backgroundColor: themeOption.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="theme-name">{themeOption.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="user-menu">
          <button
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">Saloni R.</span>
              <span className="user-role">Admin</span>
            </div>
            <ChevronDown size={14} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar large">
                  <User size={24} />
                </div>
                <div className="user-details">
                  <p className="user-full-name">Saloni Rajput</p>
                  <p className="user-email">saloni@example.com</p>
                </div>
              </div>
              
              <div className="user-dropdown-menu">
                <a href="#profile" className="dropdown-item">
                  <User size={16} />
                  Profile Settings
                </a>
                <a href="#settings" className="dropdown-item">
                  <Settings size={16} />
                  Preferences
                </a>
                <div className="dropdown-divider"></div>
                <a href="#logout" className="dropdown-item danger">
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
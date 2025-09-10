import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Settings, Grid, LayoutGrid } from 'lucide-react';
import { fetchKlips, openEditor } from '../store/store';
import Sidebar from './Sidebar';
import Header from './Header';
import KlipGrid from './KlipGrid';
import EditorPanel from './EditorPanel';
// import NotificationManager from './NotificationManager';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: klips, loading, error } = useSelector(state => state.klips);
  const { isOpen: editorOpen } = useSelector(state => state.editor);
  const { sidebarCollapsed, gridSize } = useSelector(state => state.ui);

  useEffect(() => {
    dispatch(fetchKlips());
  }, [dispatch]);

  const handleCreateKlip = () => {
    dispatch(openEditor({ mode: 'create' }));
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error loading dashboard: {error}</p>
        <button 
          onClick={() => dispatch(fetchKlips())}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`dashboard ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      
      <div className="dashboard-main">
        <Header />
        
        <div className="dashboard-content">
          {loading ? (
            <div className="dashboard-loading">
              <div className="loading-spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <>
              <div className="dashboard-toolbar">
                <div className="toolbar-left">
                  <h2>Dashboard</h2>
                  <span className="klip-count">{klips.length} widgets</span>
                </div>
                
                <div className="toolbar-right">
                  <button 
                    className="toolbar-button"
                    onClick={handleCreateKlip}
                  >
                    <Plus size={16} />
                    Add Widget
                  </button>
                  
                  <button className="toolbar-button icon-only">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
              
              <KlipGrid klips={klips} gridSize={gridSize} />
            </>
          )}
        </div>
      </div>

      {editorOpen && <EditorPanel />}
      {/* <NotificationManager /> */}
    </div>
  );
};

export default Dashboard;
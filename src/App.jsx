import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import Dashboard from './components/dashboard';
import Editor from './components/editor';
import { initializeMirageServer } from './services/mirageServer';
import { dashboardSlice } from './store/dashboardSlice';
import './styles/app.css';

// Initialize MirageJS when app starts
initializeMirageServer();

const AppContent = () => {
  const dispatch = useDispatch();
  const { klips, loading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    const loadKlips = async () => {
      try {
        dispatch(dashboardSlice.actions.setLoading(true));
        const response = await fetch('/api/klips');
        const data = await response.json();
        dispatch(dashboardSlice.actions.setKlips(data.klips));
      } catch (err) {
        dispatch(dashboardSlice.actions.setError('Failed to load klips'));
        console.error('Error loading klips:', err);
      } finally {
        dispatch(dashboardSlice.actions.setLoading(false));
      }
    };

    loadKlips();
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dashboard Builder</h1>
        <button 
          className="add-klip-btn"
          onClick={() => dispatch(dashboardSlice.actions.openEditor())}
        >
          Add New Klip
        </button>
      </header>
      <main className="app-main">
        <Dashboard />
        <Editor />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
// components/Dashboard/Dashboard.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchKlips } from '../../store/slices/klipsSlice';
import KlipsGrid from '../Klip/KlipsGrid';
import EditorPanel from '../Editor/EditorPanel';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector(state => state.theme);
  const { isOpen: isEditorOpen } = useSelector(state => state.editor);
  const { loading } = useSelector(state => state.klips);

  useEffect(() => {
    dispatch(fetchKlips());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`dashboard ${currentTheme === 'dark' ? 'dashboardDark' : currentTheme === 'blue' ? 'dashboardBlue' : 'dashboardLight'}`}>
      <div className={`dashboardContent ${isEditorOpen ? 'withEditor' : ''}`}>
        <KlipsGrid />
      </div>
      
      {isEditorOpen && <EditorPanel />}
    </div>
  );
};

export default Dashboard;
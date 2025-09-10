import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectKlip, deleteKlip, openEditor } from '../store/store';
import KlipCard from './KlipCard';
import './KlipGrid.css';

const KlipGrid = ({ klips, gridSize }) => {
  const dispatch = useDispatch();
  const { selectedKlip } = useSelector(state => state.klips);

  const handleKlipClick = (klip) => {
    dispatch(selectKlip(klip));
  };

  const handleEditKlip = (klip, e) => {
    e.stopPropagation();
    dispatch(openEditor({ mode: 'edit', klip }));
  };

  const handleDeleteKlip = (klipId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this widget?')) {
      dispatch(deleteKlip(klipId));
    }
  };

  const getGridClassName = () => {
    const baseClass = 'klip-grid';
    switch (gridSize) {
      case 'small':
        return `${baseClass} grid-small`;
      case 'large':
        return `${baseClass} grid-large`;
      default:
        return `${baseClass} grid-medium`;
    }
  };

  if (klips.length === 0) {
    return (
      <div className="klip-grid-empty">
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M7 8h10M7 12h6M7 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>No widgets yet</h3>
          <p>Get started by creating your first dashboard widget</p>
          <button 
            className="create-first-widget-btn"
            onClick={() => dispatch(openEditor({ mode: 'create' }))}
          >
            Create Your First Widget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={getGridClassName()}>
      {klips.map((klip) => (
        <KlipCard
          key={klip.id}
          klip={klip}
          isSelected={selectedKlip?.id === klip.id}
          onClick={() => handleKlipClick(klip)}
          onEdit={(e) => handleEditKlip(klip, e)}
          onDelete={(e) => handleDeleteKlip(klip.id, e)}
        />
      ))}
    </div>
  );
};

export default KlipGrid;
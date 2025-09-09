import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ChartRenderer from './chartRenderer';
import { dashboardSlice } from '../store/dashboardSlice';
import { editorSlice } from '../store/editorSlice';
import '../styles/klip.css';

const Klip = ({ klip }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    dispatch(editorSlice.actions.loadKlipData(klip));
    dispatch(dashboardSlice.actions.openEditor(klip));
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${klip.title}"?`)) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/klips/${klip.id}`, { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          dispatch(dashboardSlice.actions.removeKlip(klip.id));
        } else {
          throw new Error('Failed to delete klip');
        }
      } catch (error) {
        console.error('Error deleting klip:', error);
        dispatch(dashboardSlice.actions.setError('Failed to delete klip'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const duplicatedKlip = {
        ...klip,
        title: `${klip.title} (Copy)`,
        id: undefined // Let the server generate new ID
      };

      const response = await fetch('/api/klips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedKlip)
      });

      if (response.ok) {
        const { klip: newKlip } = await response.json();
        dispatch(dashboardSlice.actions.addKlip(newKlip));
      } else {
        throw new Error('Failed to duplicate klip');
      }
    } catch (error) {
      console.error('Error duplicating klip:', error);
      dispatch(dashboardSlice.actions.setError('Failed to duplicate klip'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`klip ${isExpanded ? 'klip-expanded' : ''}`}>
      <div className="klip-header">
        <div className="klip-title-section">
          <h3 className="klip-title">{klip.title}</h3>
          <div className="klip-meta">
            <span className="klip-type">{klip.chartType}</span>
            <span className="klip-data-count">
              {klip.data?.length || 0} records
            </span>
          </div>
        </div>
        <div className="klip-actions">
          <button 
            onClick={toggleExpand}
            className="expand-btn"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '⤢' : '⤡'}
          </button>
          <button 
            onClick={handleDuplicate}
            className="duplicate-btn"
            disabled={isLoading}
            title="Duplicate"
          >
            📋
          </button>
          <button 
            onClick={handleEdit}
            className="edit-btn"
            disabled={isLoading}
            title="Edit"
          >
            ✏️
          </button>
          <button 
            onClick={handleDelete}
            className="delete-btn"
            disabled={isLoading}
            title="Delete"
          >
            {isLoading ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>

      <div className="klip-content">
        <ChartRenderer klip={klip} isExpanded={isExpanded} />
      </div>

      {isExpanded && (
        <div className="klip-footer">
          <div className="klip-timestamps">
            {klip.createdAt && (
              <span className="timestamp">
                Created: {formatDate(klip.createdAt)}
              </span>
            )}
            {klip.updatedAt && klip.updatedAt !== klip.createdAt && (
              <span className="timestamp">
                Updated: {formatDate(klip.updatedAt)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Klip;
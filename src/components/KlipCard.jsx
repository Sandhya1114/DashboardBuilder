import React from 'react';
import { Edit3, Trash2, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import './KlipCard.css';

const KlipCard = ({ klip, isSelected, onClick, onEdit, onDelete }) => {
  const renderKlipContent = () => {
    switch (klip.type) {
      case 'chart':
        return (
          <div className="klip-chart-container">
            <ChartRenderer 
              type={klip.chartType} 
              data={klip.data} 
              config={klip.config}
            />
          </div>
        );
      
      case 'metric':
        return (
          <div className="klip-metric-container">
            <div className="metric-main">
              <span className="metric-value">
                {klip.data.unit}{klip.data.value?.toLocaleString()}
              </span>
              <span className="metric-label">{klip.data.label}</span>
            </div>
            {klip.data.change && (
              <div className={`metric-change ${klip.data.change.type}`}>
                {klip.data.change.type === 'increase' ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{Math.abs(klip.data.change.value)}%</span>
                {klip.data.comparison && (
                  <span className="metric-comparison">{klip.data.comparison}</span>
                )}
              </div>
            )}
          </div>
        );
      
      case 'table':
        return (
          <div className="klip-table-container">
            <div className="table-wrapper">
              <table className="klip-table">
                <thead>
                  <tr>
                    {klip.data.headers?.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {klip.data.rows?.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {klip.data.rows?.length > 5 && (
                <div className="table-more">
                  +{klip.data.rows.length - 5} more rows
                </div>
              )}
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="klip-text-container">
            <div className="text-content">
              {klip.data.content?.length > 200 
                ? `${klip.data.content.substring(0, 200)}...`
                : klip.data.content
              }
            </div>
          </div>
        );
      
      default:
        return (
          <div className="klip-placeholder">
            <p>Unsupported widget type: {klip.type}</p>
          </div>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`klip-card ${isSelected ? 'selected' : ''} klip-${klip.type}`}
      onClick={onClick}
    >
      <div className="klip-header">
        <div className="klip-title-section">
          <h3 className="klip-title">{klip.title}</h3>
          <span className="klip-type-badge">{klip.type}</span>
        </div>
        
        <div className="klip-actions">
          <button 
            className="klip-action-btn"
            onClick={onEdit}
            title="Edit widget"
          >
            <Edit3 size={14} />
          </button>
          <button 
            className="klip-action-btn danger"
            onClick={onDelete}
            title="Delete widget"
          >
            <Trash2 size={14} />
          </button>
          <button className="klip-action-btn">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="klip-content">
        {renderKlipContent()}
      </div>

      <div className="klip-footer">
        <div className="klip-meta">
          <span className="klip-updated">
            Updated {formatDate(klip.updatedAt)}
          </span>
        </div>
        
        {klip.config?.showLegend && klip.type === 'chart' && (
          <div className="klip-legend">
            {klip.data.datasets?.map((dataset, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ 
                    backgroundColor: klip.config.colors?.[index] || '#3b82f6' 
                  }}
                ></div>
                <span className="legend-label">{dataset.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KlipCard;
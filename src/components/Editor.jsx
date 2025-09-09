import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardSlice } from '../store/dashboardSlice';
import { editorSlice } from '../store/editorSlice';
import ChartRenderer from './chartRenderer';
import '../styles/editor.css';

const Editor = () => {
  const dispatch = useDispatch();
  const { isEditorOpen, editingKlip } = useSelector(state => state.dashboard);
  const {
    title,
    chartType,
    dataInput,
    data,
    columns,
    chartConfig,
    isDataValid,
    validationError
  } = useSelector(state => state.editor);

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const [sampleTemplates, setSampleTemplates] = useState([]);

  useEffect(() => {
    if (isEditorOpen) {
      loadSampleTemplates();
    }
  }, [isEditorOpen]);

  const loadSampleTemplates = async () => {
    try {
      const response = await fetch('/api/sample-data');
      const { templates } = await response.json();
      setSampleTemplates(templates);
    } catch (error) {
      console.error('Error loading sample templates:', error);
    }
  };

  const handleClose = () => {
    dispatch(dashboardSlice.actions.closeEditor());
    dispatch(editorSlice.actions.resetEditor());
    setActiveTab('data');
  };

  const handleDataInputChange = (value) => {
    dispatch(editorSlice.actions.setDataInput(value));
    dispatch(editorSlice.actions.parseAndValidateData(value));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your klip');
      return;
    }

    if (!isDataValid) {
      alert('Please provide valid data in JSON format');
      return;
    }

    if (chartType !== 'table' && (!chartConfig.xAxis || !chartConfig.yAxis)) {
      alert('Please configure X and Y axis for chart visualization');
      return;
    }

    setIsSaving(true);
    try {
      const klipData = {
        title,
        chartType,
        data,
        columns,
        chartConfig
      };

      let response;
      if (editingKlip) {
        response = await fetch(`/api/klips/${editingKlip.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(klipData)
        });
      } else {
        response = await fetch('/api/klips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(klipData)
        });
      }

      if (response.ok) {
        const { klip } = await response.json();
        if (editingKlip) {
          dispatch(dashboardSlice.actions.updateKlip(klip));
        } else {
          dispatch(dashboardSlice.actions.addKlip(klip));
        }
        handleClose();
      } else {
        throw new Error('Failed to save klip');
      }
    } catch (error) {
      console.error('Error saving klip:', error);
      alert('Failed to save klip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadSampleData = (template) => {
    const dataString = JSON.stringify(template.data, null, 2);
    handleDataInputChange(dataString);
  };

  const handleChartTypeChange = (newChartType) => {
    dispatch(editorSlice.actions.setChartType(newChartType));
    
    // Auto-configure axes for new chart type
    if (newChartType !== 'table' && columns.length >= 2) {
      dispatch(editorSlice.actions.setChartConfig({
        xAxis: columns[0],
        yAxis: columns[1]
      }));
    }
  };

  if (!isEditorOpen) {
    return null;
  }

  const previewKlip = {
    title: title || 'Preview',
    chartType,
    data,
    columns,
    chartConfig
  };

  return (
    <div className="editor-overlay">
      <div className="editor-modal">
        <div className="editor-header">
          <h2>{editingKlip ? 'Edit Klip' : 'Create New Klip'}</h2>
          <button onClick={handleClose} className="close-btn">✕</button>
        </div>

        <div className="editor-content">
          <div className="editor-left">
            <div className="editor-form">
              {/* Title Input */}
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => dispatch(editorSlice.actions.setTitle(e.target.value))}
                  placeholder="Enter klip title..."
                  className="form-input"
                />
              </div>

              {/* Chart Type Selection */}
              <div className="form-group">
                <label htmlFor="chartType">Chart Type</label>
                <select
                  id="chartType"
                  value={chartType}
                  onChange={(e) => handleChartTypeChange(e.target.value)}
                  className="form-select"
                >
                  <option value="table">Table</option>
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="area">Area Chart</option>
                </select>
              </div>

              {/* Tabs */}
              <div className="editor-tabs">
                <button
                  className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                  onClick={() => setActiveTab('data')}
                >
                  Data
                </button>
                <button
                  className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
                  onClick={() => setActiveTab('config')}
                  disabled={chartType === 'table'}
                >
                  Chart Config
                </button>
                <button
                  className={`tab-btn ${activeTab === 'samples' ? 'active' : ''}`}
                  onClick={() => setActiveTab('samples')}
                >
                  Sample Data
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'data' && (
                  <div className="data-tab">
                    <div className="form-group">
                      <label htmlFor="dataInput">Data (JSON Array)</label>
                      <textarea
                        id="dataInput"
                        value={dataInput}
                        onChange={(e) => handleDataInputChange(e.target.value)}
                        placeholder="Enter your data as JSON array..."
                        className={`form-textarea ${validationError ? 'error' : ''}`}
                        rows={10}
                      />
                      {validationError && (
                        <div className="error-message">{validationError}</div>
                      )}
                      {isDataValid && (
                        <div className="success-message">
                          ✓ Valid data with {data.length} records and {columns.length} columns
                        </div>
                      )}
                    </div>

                    {columns.length > 0 && (
                      <div className="columns-info">
                        <h4>Available Columns:</h4>
                        <div className="columns-list">
                          {columns.map(col => (
                            <span key={col} className="column-tag">{col}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'config' && chartType !== 'table' && (
                  <div className="config-tab">
                    <div className="form-group">
                      <label htmlFor="xAxis">
                        {chartType === 'pie' ? 'Name Field' : 'X-Axis'}
                      </label>
                      <select
                        id="xAxis"
                        value={chartConfig.xAxis}
                        onChange={(e) => dispatch(editorSlice.actions.setChartConfig({ xAxis: e.target.value }))}
                        className="form-select"
                      >
                        <option value="">Select column...</option>
                        {columns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="yAxis">
                        {chartType === 'pie' ? 'Value Field' : 'Y-Axis'}
                      </label>
                      <select
                        id="yAxis"
                        value={chartConfig.yAxis}
                        onChange={(e) => dispatch(editorSlice.actions.setChartConfig({ yAxis: e.target.value }))}
                        className="form-select"
                      >
                        <option value="">Select column...</option>
                        {columns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Color Scheme</label>
                      <div className="color-scheme">
                        {chartConfig.colorScheme.map((color, index) => (
                          <div
                            key={index}
                            className="color-box"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'samples' && (
                  <div className="samples-tab">
                    <h4>Sample Data Templates</h4>
                    <p>Click on any template to load sample data:</p>
                    <div className="sample-templates">
                      {sampleTemplates.map((template, index) => (
                        <div
                          key={index}
                          className="sample-template"
                          onClick={() => loadSampleData(template)}
                        >
                          <h5>{template.name}</h5>
                          <p>{template.data.length} records</p>
                          <div className="sample-columns">
                            {Object.keys(template.data[0]).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="editor-right">
            <div className="preview-section">
              <h3>Preview</h3>
              <div className="preview-container">
                {isDataValid ? (
                  <ChartRenderer klip={previewKlip} isExpanded={true} />
                ) : (
                  <div className="preview-placeholder">
                    <div className="placeholder-icon">👀</div>
                    <p>Enter valid data to see preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="editor-footer">
          <div className="editor-actions">
            <button
              onClick={handleClose}
              className="cancel-btn"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="save-btn"
              disabled={!isDataValid || !title.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : (editingKlip ? 'Update Klip' : 'Create Klip')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
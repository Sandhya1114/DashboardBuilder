import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  Save, 
  Eye, 
  Code, 
  Database, 
  Type, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Table,
  FileText,
  Upload,
  Download,
  Check,
  AlertCircle,
  Settings,
  Palette,
  Play,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  closeEditor, 
  updateFormData, 
  createKlip, 
  updateKlip, 
  validateData, 
  transformData,
  addNotification
} from '../store/store';
import ChartRenderer from './ChartRenderer';
import './EditorPanel.css';

const EditorPanel = () => {
  const dispatch = useDispatch();
  const { isOpen, mode, formData, validation, loading } = useSelector(state => state.editor);
  const [activeTab, setActiveTab] = useState('basic');
  const [jsonInput, setJsonInput] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [dataInputMode, setDataInputMode] = useState('json');

  useEffect(() => {
    if (formData.data) {
      setJsonInput(JSON.stringify(formData.data, null, 2));
    }
  }, [formData.data]);

  const handleInputChange = (field, value) => {
    dispatch(updateFormData({ field, value }));
  };

  const handleSave = async () => {
    try {
      const klipData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (mode === 'create') {
        await dispatch(createKlip(klipData)).unwrap();
        dispatch(addNotification({ 
          type: 'success', 
          message: 'Widget created successfully!' 
        }));
      } else {
        await dispatch(updateKlip({ id: formData.id, data: klipData })).unwrap();
        dispatch(addNotification({ 
          type: 'success', 
          message: 'Widget updated successfully!' 
        }));
      }
      dispatch(closeEditor());
    } catch (error) {
      dispatch(addNotification({ 
        type: 'error', 
        message: 'Failed to save widget. Please try again.' 
      }));
    }
  };

  const handleJsonDataChange = (value) => {
    setJsonInput(value);
    try {
      const parsedData = JSON.parse(value);
      handleInputChange('data', parsedData);
      dispatch(validateData(parsedData));
    } catch (error) {
      // Invalid JSON, don't update data
    }
  };

  const handleCsvImport = () => {
    if (csvInput.trim()) {
      dispatch(transformData({ data: csvInput, transformType: 'csvToChart' }));
      setDataInputMode('json');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          setCsvInput(content);
          setDataInputMode('csv');
        } else {
          try {
            const jsonData = JSON.parse(content);
            handleInputChange('data', jsonData);
            setJsonInput(JSON.stringify(jsonData, null, 2));
          } catch (error) {
            dispatch(addNotification({ 
              type: 'error', 
              message: 'Invalid file format. Please upload JSON or CSV files.' 
            }));
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const generateSampleData = () => {
    const sampleData = getSampleDataByType(formData.type, formData.chartType);
    handleInputChange('data', sampleData);
    setJsonInput(JSON.stringify(sampleData, null, 2));
  };

  const getSampleDataByType = (type, chartType) => {
    switch (type) {
      case 'chart':
        if (chartType === 'pie') {
          return {
            labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
            datasets: [{
              data: [45, 35, 15, 5],
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            }]
          };
        }
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Sales',
              data: [65, 59, 80, 81, 56, 55]
            },
            {
              label: 'Revenue', 
              data: [28, 48, 40, 19, 86, 27]
            }
          ]
        };
      case 'metric':
        return {
          value: 12345,
          label: 'Total Sales',
          unit: '$',
          change: { value: 12.5, type: 'increase' },
          comparison: 'vs last month'
        };
      case 'table':
        return {
          headers: ['Product', 'Sales', 'Revenue', 'Status'],
          rows: [
            ['Product A', '150', '$15,000', 'Active'],
            ['Product B', '89', '$8,900', 'Active'],
            ['Product C', '234', '$23,400', 'Inactive'],
            ['Product D', '167', '$16,700', 'Active']
          ]
        };
      case 'text':
        return {
          content: 'This is sample text content. You can add any information here including **markdown formatting**, links, or plain text.',
          format: 'markdown'
        };
      default:
        return {};
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic', icon: Type, description: 'Configure widget basics' },
    { id: 'data', label: 'Data', icon: Database, description: 'Input and manage data' },
    { id: 'style', label: 'Style', icon: Palette, description: 'Customize appearance' },
    { id: 'preview', label: 'Preview', icon: Eye, description: 'Preview your widget' }
  ];

  const widgetTypes = [
    { 
      id: 'chart', 
      label: 'Chart', 
      icon: BarChart3, 
      description: 'Visualize data with interactive charts',
      color: '#3b82f6'
    },
    { 
      id: 'metric', 
      label: 'Metric', 
      icon: TrendingUp, 
      description: 'Display key performance indicators',
      color: '#10b981'
    },
    { 
      id: 'table', 
      label: 'Table', 
      icon: Table, 
      description: 'Show structured data in rows and columns',
      color: '#f59e0b'
    },
    { 
      id: 'text', 
      label: 'Text', 
      icon: FileText, 
      description: 'Add rich text content and documentation',
      color: '#8b5cf6'
    }
  ];

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', description: 'Compare values across categories' },
    { id: 'line', label: 'Line Chart', description: 'Show trends over time' },
    { id: 'pie', label: 'Pie Chart', description: 'Display proportions of a whole' },
    { id: 'area', label: 'Area Chart', description: 'Emphasize magnitude of change' }
  ];

  if (!isOpen) return null;

  return (
    <div className="editorOverlay">
      <div className="editorPanel">
        {/* Header */}
        <div className="editorHeader">
          <div className="editorTitleSection">
            <div className="editorTitle">
              <h2>{mode === 'create' ? 'Create New Widget' : 'Edit Widget'}</h2>
              <p>Configure your dashboard widget with data and styling options</p>
            </div>
            <div className="editorStatus">
              {validation?.isValid !== false ? (
                <span className="statusBadge statusSuccess">
                  <Check size={14} />
                  Valid
                </span>
              ) : (
                <span className="statusBadge statusError">
                  <AlertCircle size={14} />
                  Issues
                </span>
              )}
            </div>
          </div>
          <div className="editorHeaderActions">
            <button className="btnPrimary" onClick={handleSave} disabled={loading}>
              {loading ? <RefreshCw size={16} className="spinning" /> : <Save size={16} />}
              Save Widget
            </button>
            <button className="editorClose" onClick={() => dispatch(closeEditor())}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="editorBody">
          {/* Sidebar Navigation */}
          <div className="editorSidebar">
            <nav className="editorTabs">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`editorTab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon size={18} />
                    <div className="editorTabContent">
                      <span className="editorTabLabel">{tab.label}</span>
                      <span className="editorTabDesc">{tab.description}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="editorMain">
            <div className="editorContent">
              {/* Basic Configuration */}
              {activeTab === 'basic' && (
                <div className="editorSection">
                  <div className="sectionHeader">
                    <h3>Basic Configuration</h3>
                    <p>Set up the fundamental properties of your widget</p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Widget Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a descriptive title for your widget"
                      className="formInput"
                    />
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Widget Type</label>
                    <div className="widgetTypeGrid">
                      {widgetTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.id}
                            className={`widgetTypeCard ${formData.type === type.id ? 'selected' : ''}`}
                            onClick={() => handleInputChange('type', type.id)}
                            style={{ '--accent-color': type.color }}
                          >
                            <div className="widgetTypeIcon">
                              <Icon size={24} />
                            </div>
                            <div className="widgetTypeContent">
                              <h4>{type.label}</h4>
                              <p>{type.description}</p>
                            </div>
                            {formData.type === type.id && (
                              <div className="selectedIndicator">
                                <Check size={16} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {formData.type === 'chart' && (
                    <div className="formGroup">
                      <label className="formLabel">Chart Type</label>
                      <div className="chartTypeGrid">
                        {chartTypes.map(chart => (
                          <div
                            key={chart.id}
                            className={`chartTypeCard ${formData.chartType === chart.id ? 'selected' : ''}`}
                            onClick={() => handleInputChange('chartType', chart.id)}
                          >
                            <h5>{chart.label}</h5>
                            <p>{chart.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Data Configuration */}
              {activeTab === 'data' && (
                <div className="editorSection">
                  <div className="sectionHeader">
                    <h3>Data Configuration</h3>
                    <p>Input and manage the data for your widget</p>
                  </div>

                  <div className="dataInputHeader">
                    <div className="dataInputTabs">
                      <button 
                        className={`dataTab ${dataInputMode === 'json' ? 'active' : ''}`}
                        onClick={() => setDataInputMode('json')}
                      >
                        <Code size={16} />
                        JSON Editor
                      </button>
                      <button 
                        className={`dataTab ${dataInputMode === 'csv' ? 'active' : ''}`}
                        onClick={() => setDataInputMode('csv')}
                      >
                        <Table size={16} />
                        CSV Import
                      </button>
                    </div>
                    <div className="dataActions">
                      <button 
                        className="btnSecondary"
                        onClick={generateSampleData}
                      >
                        <Sparkles size={16} />
                        Generate Sample
                      </button>
                      <label className="btnSecondary fileUpload">
                        <Upload size={16} />
                        Upload File
                        <input
                          type="file"
                          accept=".json,.csv,.txt"
                          onChange={handleFileUpload}
                          hidden
                        />
                      </label>
                    </div>
                  </div>

                  {dataInputMode === 'json' ? (
                    <div className="jsonEditor">
                      <textarea
                        value={jsonInput}
                        onChange={(e) => handleJsonDataChange(e.target.value)}
                        placeholder="Enter JSON data here..."
                        className="jsonTextarea"
                        rows={15}
                      />
                      {validation && validation.errors && validation.errors.length > 0 && (
                        <div className="validationErrors">
                          <AlertCircle size={16} />
                          <div>
                            <p>Data validation errors:</p>
                            <ul>
                              {validation.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {validation && validation.suggestions && validation.suggestions.length > 0 && (
                        <div className="validationSuggestions">
                          <Check size={16} />
                          <div>
                            <p>Suggestions:</p>
                            <ul>
                              {validation.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="csvEditor">
                      <textarea
                        value={csvInput}
                        onChange={(e) => setCsvInput(e.target.value)}
                        placeholder="Paste CSV data here...&#10;Name,Value1,Value2&#10;Item 1,100,200&#10;Item 2,150,250"
                        className="csvTextarea"
                        rows={10}
                      />
                      <button 
                        className="btnPrimary"
                        onClick={handleCsvImport}
                        disabled={!csvInput.trim()}
                      >
                        <Database size={16} />
                        Import CSV Data
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Style Configuration */}
              {activeTab === 'style' && (
                <div className="editorSection">
                  <div className="sectionHeader">
                    <h3>Style Configuration</h3>
                    <p>Customize the appearance of your widget</p>
                  </div>

                  <div className="formGroup">
                    <div className="checkboxGroup">
                      <label className="checkboxLabel">
                        <input
                          type="checkbox"
                          checked={formData.config?.showTitle !== false}
                          onChange={(e) => handleInputChange('config.showTitle', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Show Title
                      </label>
                    </div>
                  </div>

                  {(formData.type === 'chart') && (
                    <div className="formGroup">
                      <div className="checkboxGroup">
                        <label className="checkboxLabel">
                          <input
                            type="checkbox"
                            checked={formData.config?.showLegend !== false}
                            onChange={(e) => handleInputChange('config.showLegend', e.target.checked)}
                          />
                          <span className="checkmark"></span>
                          Show Legend
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="formGroup">
                    <label className="formLabel">Color Palette</label>
                    <div className="colorPalette">
                      {(formData.config?.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']).map((color, index) => (
                        <input
                          key={index}
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...(formData.config?.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'])];
                            newColors[index] = e.target.value;
                            handleInputChange('config.colors', newColors);
                          }}
                          className="colorInput"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="formGroup">
                    <div className="checkboxGroup">
                      <label className="checkboxLabel">
                        <input
                          type="checkbox"
                          checked={formData.config?.animation !== false}
                          onChange={(e) => handleInputChange('config.animation', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Enable Animations
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {activeTab === 'preview' && (
                <div className="editorSection">
                  <div className="sectionHeader">
                    <h3>Widget Preview</h3>
                    <p>See how your widget will look on the dashboard</p>
                  </div>
                  <div className="previewContainer">
                    <div className="previewWidget">
                      <div className="previewHeader">
                        <h4>{formData.title || 'Untitled Widget'}</h4>
                        <span className="previewType">{formData.type}</span>
                      </div>
                      <div className="previewContent">
                        {formData.type === 'chart' && formData.data ? (
                          <ChartRenderer 
                            type={formData.chartType}
                            data={formData.data}
                            config={formData.config}
                          />
                        ) : formData.type === 'metric' && formData.data ? (
                          <div className="previewMetric">
                            <div className="metricValue">
                              {formData.data.unit}{formData.data.value?.toLocaleString()}
                            </div>
                            <div className="metricLabel">{formData.data.label}</div>
                            {formData.data.change && (
                              <div className={`metricChange ${formData.data.change.type}`}>
                                {formData.data.change.value > 0 ? '+' : ''}{formData.data.change.value}%
                                {formData.data.comparison && ` ${formData.data.comparison}`}
                              </div>
                            )}
                          </div>
                        ) : formData.type === 'table' && formData.data ? (
                          <div className="previewTable">
                            <table>
                              <thead>
                                <tr>
                                  {formData.data.headers?.map((header, index) => (
                                    <th key={index}>{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {formData.data.rows?.slice(0, 3).map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                      <td key={cellIndex}>{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : formData.type === 'text' && formData.data ? (
                          <div className="previewText">
                            <div className="textContent">
                              {formData.data.content}
                            </div>
                          </div>
                        ) : (
                          <div className="previewEmpty">
                            <p>No data available for preview</p>
                            <button 
                              className="btnSecondary"
                              onClick={() => setActiveTab('data')}
                            >
                              Add Data
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
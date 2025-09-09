import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  ResponsiveContainer 
} from 'recharts';
// import '../styles/chartRenderer.css';

// Table Component
const TableChart = ({ data, columns, isExpanded }) => {
  const displayData = isExpanded ? data : data.slice(0, 5);
  
  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, index) => (
              <tr key={index}>
                {columns.map(col => (
                  <td key={col}>
                    {typeof row[col] === 'number' 
                      ? row[col].toLocaleString() 
                      : row[col]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isExpanded && data.length > 5 && (
        <div className="table-footer">
          <span className="more-rows">
            +{data.length - 5} more rows
          </span>
        </div>
      )}
    </div>
  );
};

// Line Chart Component
const LineChartComponent = ({ data, config, isExpanded }) => {
  const size = isExpanded ? { width: '100%', height: 400 } : { width: '100%', height: 300 };
  
  return (
    <ResponsiveContainer width={size.width} height={size.height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={config.xAxis} 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }} 
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={config.yAxis} 
          stroke={config.colorScheme[0]} 
          strokeWidth={2}
          dot={{ fill: config.colorScheme[0], strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Bar Chart Component
const BarChartComponent = ({ data, config, isExpanded }) => {
  const size = isExpanded ? { width: '100%', height: 400 } : { width: '100%', height: 300 };
  
  return (
    <ResponsiveContainer width={size.width} height={size.height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={config.xAxis} 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }} 
        />
        <Legend />
        <Bar 
          dataKey={config.yAxis} 
          fill={config.colorScheme[0]}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Pie Chart Component
const PieChartComponent = ({ data, config, isExpanded }) => {
  const size = isExpanded ? { width: '100%', height: 400 } : { width: '100%', height: 300 };
  const radius = isExpanded ? 120 : 80;
  
  return (
    <ResponsiveContainer width={size.width} height={size.height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          outerRadius={radius}
          fill="#8884d8"
          dataKey={config.yAxis}
          nameKey={config.xAxis}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={config.colorScheme[index % config.colorScheme.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Area Chart Component
const AreaChartComponent = ({ data, config, isExpanded }) => {
  const size = isExpanded ? { width: '100%', height: 400 } : { width: '100%', height: 300 };
  
  return (
    <ResponsiveContainer width={size.width} height={size.height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={config.xAxis} 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }} 
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey={config.yAxis} 
          stackId="1" 
          stroke={config.colorScheme[0]} 
          fill={config.colorScheme[0]}
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Main Chart Renderer Component
const ChartRenderer = ({ klip, isExpanded = false }) => {
  const { chartType, data, columns, chartConfig } = klip;

  if (!data || data.length === 0) {
    return (
      <div className="no-data">
        <div className="no-data-icon">📊</div>
        <p>No data available</p>
      </div>
    );
  }

  if (!chartConfig) {
    return (
      <div className="config-error">
        <div className="error-icon">⚠️</div>
        <p>Chart configuration missing</p>
      </div>
    );
  }

  try {
    switch (chartType) {
      case 'table':
        return <TableChart data={data} columns={columns} isExpanded={isExpanded} />;
      case 'line':
        if (!chartConfig.xAxis || !chartConfig.yAxis) {
          return (
            <div className="config-error">
              <p>Please configure X and Y axis for line chart</p>
            </div>
          );
        }
        return <LineChartComponent data={data} config={chartConfig} isExpanded={isExpanded} />;
      case 'bar':
        if (!chartConfig.xAxis || !chartConfig.yAxis) {
          return (
            <div className="config-error">
              <p>Please configure X and Y axis for bar chart</p>
            </div>
          );
        }
        return <BarChartComponent data={data} config={chartConfig} isExpanded={isExpanded} />;
      case 'pie':
        if (!chartConfig.xAxis || !chartConfig.yAxis) {
          return (
            <div className="config-error">
              <p>Please configure name and value fields for pie chart</p>
            </div>
          );
        }
        return <PieChartComponent data={data} config={chartConfig} isExpanded={isExpanded} />;
      case 'area':
        if (!chartConfig.xAxis || !chartConfig.yAxis) {
          return (
            <div className="config-error">
              <p>Please configure X and Y axis for area chart</p>
            </div>
          );
        }
        return <AreaChartComponent data={data} config={chartConfig} isExpanded={isExpanded} />;
      default:
        return <TableChart data={data} columns={columns} isExpanded={isExpanded} />;
    }
  } catch (error) {
    console.error('Error rendering chart:', error);
    return (
      <div className="render-error">
        <div className="error-icon">❌</div>
        <p>Error rendering chart</p>
        <small>{error.message}</small>
      </div>
    );
  }
};

export default ChartRenderer;
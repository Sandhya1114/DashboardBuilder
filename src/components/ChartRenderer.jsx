import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartRenderer = ({ type, data, config = {} }) => {
  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="chart-empty">
        <p>No data available</p>
      </div>
    );
  }

  // Transform data for recharts format
  const transformDataForCharts = () => {
    if (type === 'pie') {
      // For pie charts, use the first dataset
      const dataset = data.datasets[0];
      return data.labels?.map((label, index) => ({
        name: label,
        value: dataset.data[index] || 0,
        fill: config.colors?.[index] || `hsl(${index * 45}, 70%, 50%)`
      })) || [];
    }

    // For bar and line charts
    return data.labels?.map((label, index) => {
      const item = { name: label };
      data.datasets.forEach((dataset, datasetIndex) => {
        item[dataset.label || `Dataset ${datasetIndex + 1}`] = dataset.data[index] || 0;
      });
      return item;
    }) || [];
  };

  const chartData = transformDataForCharts();
  
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const colors = config.colors || defaultColors;

  const commonProps = {
    width: '100%',
    height: '100%',
    data: chartData,
    margin: { top: 5, right: 5, left: 5, bottom: 5 }
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chartData} >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="name" 
                fontSize={11} 
                fill="var(--text-secondary)"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                fontSize={11} 
                fill="var(--text-secondary)"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {config.showLegend && (
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                />
              )}
              {data.datasets.map((dataset, index) => (
                <Bar
                  key={dataset.label || index}
                  dataKey={dataset.label || `Dataset ${index + 1}`}
                  fill={colors[index % colors.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="name" 
                fontSize={11} 
                fill="var(--text-secondary)"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                fontSize={11} 
                fill="var(--text-secondary)"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {config.showLegend && (
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                />
              )}
              {data.datasets.map((dataset, index) => (
                <Line
                  key={dataset.label || index}
                  type="monotone"
                  dataKey={dataset.label || `Dataset ${index + 1}`}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], r: 3 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill || colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {config.showLegend && (
                <Legend 
                  wrapperStyle={{ fontSize: '10px' }}
                  iconSize={8}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="name" 
                fontSize={11} 
                fill="var(--text-secondary)"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                fontSize={11} 
                fill="var(--text-secondary)"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              {config.showLegend && (
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                />
              )}
              {data.datasets.map((dataset, index) => (
                <Line
                  key={dataset.label || index}
                  type="monotone"
                  dataKey={dataset.label || `Dataset ${index + 1}`}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                  dot={{ fill: colors[index % colors.length], r: 3 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="chart-unsupported">
            <p>Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div className="chart-renderer" >
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;
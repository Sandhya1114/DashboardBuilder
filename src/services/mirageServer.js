import { createServer, Model, Factory, Response } from 'miragejs';

export function setupMirage() {
  return createServer({
    models: {
      klip: Model,
      dataSource: Model,
    },

    factories: {
      klip: Factory.extend({
        id(i) { return i + 1; },
        title() { return `Sample Klip ${this.id}`; },
        type() { 
          const types = ['chart', 'metric', 'table', 'text'];
          return types[Math.floor(Math.random() * types.length)];
        },
        chartType() {
          const chartTypes = ['bar', 'line', 'pie', 'area'];
          return chartTypes[Math.floor(Math.random() * chartTypes.length)];
        },
        position() {
          return { x: 0, y: 0, width: 1, height: 1 };
        },
        config() {
          return {
            showTitle: true,
            showLegend: true,
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            animation: true
          };
        },
        data() {
          // Generate dynamic sample data based on type
          const klipType = this.type;
          switch (klipType) {
            case 'chart':
              return {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Sales',
                    data: Array.from({length: 6}, () => Math.floor(Math.random() * 100) + 20)
                  },
                  {
                    label: 'Revenue',
                    data: Array.from({length: 6}, () => Math.floor(Math.random() * 100) + 30)
                  }
                ]
              };
            case 'metric':
              return {
                value: Math.floor(Math.random() * 10000) + 1000,
                label: 'Total Revenue',
                unit: '$',
                change: {
                  value: Math.floor(Math.random() * 20) - 10,
                  type: Math.random() > 0.5 ? 'increase' : 'decrease'
                },
                comparison: 'vs last month'
              };
            case 'table':
              return {
                headers: ['Name', 'City', 'Sales', 'Status'],
                rows: Array.from({length: 8}, (_, i) => [
                  `User ${i + 1}`,
                  ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'][Math.floor(Math.random() * 4)],
                  `$${Math.floor(Math.random() * 5000) + 1000}`,
                  Math.random() > 0.5 ? 'Active' : 'Inactive'
                ])
              };
            case 'text':
              return {
                content: 'This is a sample text widget. You can add any custom content here including markdown, HTML, or plain text.',
                format: 'text'
              };
            default:
              return {};
          }
        },
        createdAt() { return new Date().toISOString(); },
        updatedAt() { return new Date().toISOString(); }
      }),

      dataSource: Factory.extend({
        id(i) { return i + 1; },
        name() { return `Data Source ${this.id}`; },
        type() {
          const types = ['api', 'csv', 'json', 'database'];
          return types[Math.floor(Math.random() * types.length)];
        },
        endpoint() { return `https://api.example.com/data/${this.id}`; },
        config() {
          return {
            refreshInterval: 30000,
            authentication: false,
            headers: {}
          };
        },
        schema() {
          return {
            fields: [
              { name: 'id', type: 'number', required: true },
              { name: 'name', type: 'string', required: true },
              { name: 'value', type: 'number', required: false },
              { name: 'category', type: 'string', required: false },
              { name: 'date', type: 'date', required: false }
            ]
          };
        }
      })
    },

    seeds(server) {
      // Create sample klips
      server.createList('klip', 6);
      server.createList('dataSource', 3);
    },

    routes() {
      this.namespace = 'api';

      // Klips endpoints
      this.get('/klips', (schema) => {
        return schema.klips.all();
      });

      this.get('/klips/:id', (schema, request) => {
        const id = request.params.id;
        return schema.klips.find(id);
      });

      this.post('/klips', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = Date.now(); // Generate unique ID
        attrs.createdAt = new Date().toISOString();
        attrs.updatedAt = new Date().toISOString();
        
        // Set default data based on type
        if (!attrs.data) {
          attrs.data = generateDefaultData(attrs.type, attrs.chartType);
        }
        
        return schema.klips.create(attrs);
      });

      this.put('/klips/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        attrs.updatedAt = new Date().toISOString();
        
        return schema.klips.find(id).update(attrs);
      });

      this.delete('/klips/:id', (schema, request) => {
        const id = request.params.id;
        schema.klips.find(id).destroy();
        return new Response(204);
      });

      // Data Sources endpoints
      this.get('/data-sources', (schema) => {
        return schema.dataSources.all();
      });

      this.post('/data-sources', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = Date.now();
        return schema.dataSources.create(attrs);
      });

      // Generic data endpoint for custom user data
      this.post('/data/validate', (schema, request) => {
        const data = JSON.parse(request.requestBody);
        
        // Validate data structure
        try {
          const validation = validateData(data);
          return { valid: validation.valid, errors: validation.errors, suggestions: validation.suggestions };
        } catch (error) {
          return new Response(400, {}, { error: 'Invalid data format' });
        }
      });

      this.post('/data/transform', (schema, request) => {
        const { data, transformType } = JSON.parse(request.requestBody);
        
        try {
          const transformedData = transformData(data, transformType);
          return { data: transformedData };
        } catch (error) {
          return new Response(400, {}, { error: 'Transformation failed' });
        }
      });
    },
  });
}

// Helper function to generate default data based on klip type
function generateDefaultData(type, chartType) {
  switch (type) {
    case 'chart':
      if (chartType === 'pie') {
        return {
          labels: ['Desktop', 'Mobile', 'Tablet'],
          datasets: [{
            data: [45, 35, 20],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
          }]
        };
      }
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Sample Data',
          data: [12, 19, 3, 5, 2],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      };
    case 'metric':
      return {
        value: 0,
        label: 'New Metric',
        unit: '',
        change: { value: 0, type: 'neutral' }
      };
    case 'table':
      return {
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          ['Row 1', 'Data 1', 'Value 1'],
          ['Row 2', 'Data 2', 'Value 2']
        ]
      };
    case 'text':
      return {
        content: 'Enter your text content here...',
        format: 'text'
      };
    default:
      return {};
  }
}

// Validate user data
function validateData(data) {
  const errors = [];
  const suggestions = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Data must be a valid object');
    return { valid: false, errors, suggestions };
  }
  
  // Check for common chart data structure
  if (data.labels && Array.isArray(data.labels)) {
    suggestions.push('Detected chart data structure');
    if (!data.datasets || !Array.isArray(data.datasets)) {
      errors.push('Chart data requires datasets array');
    }
  }
  
  // Check for table data structure
  if (data.headers && Array.isArray(data.headers)) {
    suggestions.push('Detected table data structure');
    if (!data.rows || !Array.isArray(data.rows)) {
      errors.push('Table data requires rows array');
    }
  }
  
  // Check for metric data structure
  if (typeof data.value === 'number') {
    suggestions.push('Detected metric data structure');
  }
  
  return { valid: errors.length === 0, errors, suggestions };
}

// Transform data based on type
function transformData(data, transformType) {
  switch (transformType) {
    case 'arrayToChart':
      if (Array.isArray(data)) {
        return {
          labels: data.map((_, index) => `Item ${index + 1}`),
          datasets: [{
            label: 'Data',
            data: data.map(item => typeof item === 'number' ? item : Object.keys(item).length)
          }]
        };
      }
      break;
    case 'objectToTable':
      if (typeof data === 'object' && !Array.isArray(data)) {
        return {
          headers: ['Key', 'Value'],
          rows: Object.entries(data).map(([key, value]) => [key, String(value)])
        };
      }
      break;
    case 'csvToChart':
      // Simple CSV parsing (assuming first row is headers)
      if (typeof data === 'string') {
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');
        const values = lines.slice(1).map(line => line.split(','));
        
        return {
          labels: values.map(row => row[0]),
          datasets: headers.slice(1).map((header, index) => ({
            label: header.trim(),
            data: values.map(row => parseFloat(row[index + 1]) || 0)
          }))
        };
      }
      break;
    default:
      return data;
  }
  
  return data;
}
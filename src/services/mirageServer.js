import { createServer } from 'miragejs';

export const initializeMirageServer = () => {
  createServer({
    routes() {
      // Get all klips
      this.get('/api/klips', () => {
        const klips = JSON.parse(localStorage.getItem('dashboardKlips') || '[]');
        return { klips };
      });

      // Create new klip
      this.post('/api/klips', (schema, request) => {
        const klipData = JSON.parse(request.requestBody);
        const newKlip = {
          id: Math.random().toString(36).substr(2, 9),
          ...klipData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const klips = JSON.parse(localStorage.getItem('dashboardKlips') || '[]');
        klips.push(newKlip);
        localStorage.setItem('dashboardKlips', JSON.stringify(klips));

        return { klip: newKlip };
      });

      // Update existing klip
      this.put('/api/klips/:id', (schema, request) => {
        const klipData = JSON.parse(request.requestBody);
        const klipId = request.params.id;
        
        const klips = JSON.parse(localStorage.getItem('dashboardKlips') || '[]');
        const klipIndex = klips.findIndex(k => k.id === klipId);
        
        if (klipIndex !== -1) {
          const updatedKlip = {
            ...klips[klipIndex],
            ...klipData,
            updatedAt: new Date().toISOString()
          };
          klips[klipIndex] = updatedKlip;
          localStorage.setItem('dashboardKlips', JSON.stringify(klips));
          return { klip: updatedKlip };
        }
        
        return { error: 'Klip not found' };
      });

      // Delete klip
      this.delete('/api/klips/:id', (schema, request) => {
        const klipId = request.params.id;
        const klips = JSON.parse(localStorage.getItem('dashboardKlips') || '[]');
        const filteredKlips = klips.filter(k => k.id !== klipId);
        localStorage.setItem('dashboardKlips', JSON.stringify(filteredKlips));
        return { success: true };
      });

      // Get sample data templates
      this.get('/api/sample-data', () => {
        return {
          templates: [
            {
              name: 'Sales Data',
              data: [
                { month: 'Jan', sales: 4000, profit: 2400 },
                { month: 'Feb', sales: 3000, profit: 1398 },
                { month: 'Mar', sales: 2000, profit: 9800 },
                { month: 'Apr', sales: 2780, profit: 3908 },
                { month: 'May', sales: 1890, profit: 4800 },
                { month: 'Jun', sales: 2390, profit: 3800 }
              ]
            },
            {
              name: 'User Analytics',
              data: [
                { category: 'Desktop', users: 2400, sessions: 4000 },
                { category: 'Mobile', users: 1398, sessions: 3000 },
                { category: 'Tablet', users: 9800, sessions: 2000 }
              ]
            },
            {
              name: 'Product Performance',
              data: [
                { product: 'Product A', quantity: 120, revenue: 12000 },
                { product: 'Product B', quantity: 80, revenue: 8000 },
                { product: 'Product C', quantity: 150, revenue: 15000 },
                { product: 'Product D', quantity: 90, revenue: 9000 }
              ]
            },
            {
              name: 'Employee Data',
              data: [
                { name: 'John Doe', department: 'Engineering', salary: 75000, experience: 5 },
                { name: 'Jane Smith', department: 'Marketing', salary: 65000, experience: 3 },
                { name: 'Mike Johnson', department: 'Sales', salary: 60000, experience: 7 },
                { name: 'Sarah Wilson', department: 'HR', salary: 55000, experience: 2 }
              ]
            }
          ]
        };
      });
    }
  });
};
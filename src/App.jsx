import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { setupMirage } from './services/mirageServer';
import Dashboard from './components/Dashboard';
// import ThemeProvider from './components/ThemeProvider';
import './styles/global.css';

// Setup MirageJS server
setupMirage();

function App() {
  return (
    <Provider store={store}>
      {/* <ThemeProvider> */}
        <div className="app">
          <Dashboard />
        </div>
      {/* </ThemeProvider> */}
    </Provider>
  );
}

export default App;
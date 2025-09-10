import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector(state => state.ui);

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save theme preference to localStorage
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme && savedTheme !== theme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;
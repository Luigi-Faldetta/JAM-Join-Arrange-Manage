import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxFiles/store';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useSelector((state: RootState) => state.preferencesReducer.theme);

  useEffect(() => {
    // Log for debugging in production
    console.log('ThemeProvider: Current theme:', theme);
    
    // Ensure clean state
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all possible theme classes
    root.className = root.className.replace(/\b(dark|light)\b/g, '').trim();
    body.className = body.className.replace(/\b(dark|light)\b/g, '').trim();
    
    // Apply the correct theme
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      body.classList.add('light');
      root.setAttribute('data-theme', 'light');
    }
    
    // Force style recalculation
    void root.offsetHeight;
  }, [theme]);

  return <>{children}</>;
};
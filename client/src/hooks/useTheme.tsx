import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxFiles/store';

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.preferencesReducer.theme);

  useEffect(() => {
    // Remove all theme classes first to ensure clean state
    document.documentElement.classList.remove('dark', 'light');
    document.body.classList.remove('dark', 'light');
    
    // Apply theme to document body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    }
    
    // Force a repaint to ensure theme is applied
    document.documentElement.style.display = 'none';
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    document.documentElement.offsetHeight; // Trigger reflow
    document.documentElement.style.display = '';
  }, [theme]);

  return theme;
};
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxFiles/store';

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.preferencesReducer.theme);

  useEffect(() => {
    // Apply theme to document body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return theme;
};
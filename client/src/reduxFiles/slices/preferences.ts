import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Currency = 'USD' | 'EUR' | 'GBP';
export type Language = 'en' | 'es' | 'fr';
export type Theme = 'light' | 'dark';

interface PreferencesState {
  currency: Currency;
  language: Language;
  theme: Theme;
}

const initialState: PreferencesState = {
  currency: 'USD',
  language: 'en',
  theme: 'light',
};

// Load preferences from localStorage if available
const loadPreferences = (): PreferencesState => {
  try {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      return { ...initialState, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  return initialState;
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: loadPreferences(),
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
      // Save to localStorage
      try {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Save to localStorage
      try {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      // Save to localStorage
      try {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    },
    setPreferences: (state, action: PayloadAction<Partial<PreferencesState>>) => {
      Object.assign(state, action.payload);
      // Save to localStorage
      try {
        localStorage.setItem('userPreferences', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    },
  },
});

export const { setCurrency, setLanguage, setTheme, setPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;

// Currency symbols
export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

// Helper function to format currency with appropriate symbol
export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = currencySymbols[currency];
  const formatted = amount.toFixed(2);
  
  // Always place symbol before the amount
  return `${symbol}${formatted}`;
};
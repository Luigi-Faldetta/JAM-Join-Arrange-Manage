import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../reduxFiles/store';
import { setCurrency, setLanguage, setTheme, Currency, Language, Theme } from '../../reduxFiles/slices/preferences';
import { FiX, FiGlobe, FiMoon, FiSun, FiDollarSign } from 'react-icons/fi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
];

const languages: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
];

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <FiSun className="w-4 h-4" /> },
  { value: 'dark', label: 'Dark', icon: <FiMoon className="w-4 h-4" /> },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const preferences = useSelector((state: RootState) => state.preferencesReducer);
  
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(preferences.currency);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(preferences.language);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(preferences.theme);

  const handleSave = () => {
    dispatch(setCurrency(selectedCurrency));
    dispatch(setLanguage(selectedLanguage));
    dispatch(setTheme(selectedTheme));
    onClose();
  };

  const handleCancel = () => {
    // Reset to current preferences
    setSelectedCurrency(preferences.currency);
    setSelectedLanguage(preferences.language);
    setSelectedTheme(preferences.theme);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Currency Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiDollarSign className="w-5 h-5" />
                  <h3 className="font-semibold">Currency</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {currencies.map((currency) => (
                    <button
                      key={currency.value}
                      onClick={() => setSelectedCurrency(currency.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedCurrency === currency.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{currency.symbol}</div>
                      <div className="text-sm font-medium">{currency.value}</div>
                      <div className="text-xs text-gray-600">{currency.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiGlobe className="w-5 h-5" />
                  <h3 className="font-semibold">Language</h3>
                </div>
                <div className="space-y-2">
                  {languages.map((language) => (
                    <button
                      key={language.value}
                      onClick={() => setSelectedLanguage(language.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                        selectedLanguage === language.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <span className="font-medium">{language.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiMoon className="w-5 h-5" />
                  <h3 className="font-semibold">Theme</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setSelectedTheme(theme.value)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                        selectedTheme === theme.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {theme.icon}
                      <span className="font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 rounded-b-2xl flex items-center justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
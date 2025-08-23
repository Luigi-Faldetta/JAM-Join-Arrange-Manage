// This script runs before React to prevent theme flash
(function() {
  try {
    // Get saved preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    let theme = 'light'; // Default theme
    
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      theme = preferences.theme || 'light';
    }
    
    // Remove any existing theme classes
    document.documentElement.classList.remove('dark', 'light');
    document.body.classList.remove('dark', 'light');
    
    // Apply the theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    }
  } catch (e) {
    // If anything fails, default to light theme
    console.error('Theme initialization error:', e);
    document.documentElement.classList.add('light');
    document.body.classList.add('light');
  }
})();
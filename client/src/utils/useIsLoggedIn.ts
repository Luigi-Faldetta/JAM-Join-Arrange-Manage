import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxFiles/store';
import { getAuthToken, isAuthenticated } from '../services/ApiResponseType';

export const useIsLoggedIn = () => {
  const logoutModal = useSelector((state: RootState) =>
    state.logoutReducer?.valueOf()
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      const token = getAuthToken();
      const authenticated = isAuthenticated();

      // Additional validation could be added here
      // For example, checking token expiration or making a validation request

      setIsLoggedIn(authenticated);
      setIsLoading(false);
    };

    // Check auth status immediately
    checkAuthStatus();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logoutModal]);

  return { isLoggedIn, isLoading };
};

// Alternative hook that returns just the boolean for backward compatibility
export const useIsLoggedInSimple = (): boolean => {
  const { isLoggedIn } = useIsLoggedIn();
  return isLoggedIn;
};

// Hook for getting current user token
export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const currentToken = getAuthToken();
    setToken(currentToken);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return token;
};

// Hook for authentication state with user data
export const useAuthState = () => {
  const { isLoggedIn, isLoading } = useIsLoggedIn();
  const token = useAuthToken();

  return {
    isLoggedIn,
    isLoading,
    token,
    isAuthenticated: isLoggedIn && !!token,
  };
};

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsLoggedIn } from './useIsLoggedIn';
import { getAuthToken, removeAuthToken } from '../services/ApiResponseType';

interface UseAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const { redirectTo = '/', requireAuth = true, onAuthChange } = options;

  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useIsLoggedIn();

  // Logout function
  const logout = useCallback(() => {
    removeAuthToken();
    navigate(redirectTo);
  }, [navigate, redirectTo]);

  // Check authentication and redirect if necessary
  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isLoggedIn) {
        navigate(redirectTo);
      }

      // Call the auth change callback if provided
      if (onAuthChange) {
        onAuthChange(isLoggedIn);
      }
    }
  }, [isLoggedIn, isLoading, navigate, redirectTo, requireAuth, onAuthChange]);

  return {
    isLoggedIn,
    isLoading,
    logout,
    token: getAuthToken(),
  };
};

// Hook for protecting routes that require authentication
export const useRequireAuth = (redirectTo: string = '/') => {
  return useAuth({
    redirectTo,
    requireAuth: true,
  });
};

// Hook for routes that should redirect authenticated users (like login page)
export const useRedirectIfAuthenticated = (
  redirectTo: string = '/dashboard'
) => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useIsLoggedIn();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate(redirectTo);
    }
  }, [isLoggedIn, isLoading, navigate, redirectTo]);

  return { isLoggedIn, isLoading };
};

// Hook for getting current user ID from token
export const useCurrentUserId = (): string | null => {
  const token = getAuthToken();

  if (!token) return null;

  try {
    // If your token is a JWT, you can decode it to get user info
    // For now, we'll assume the token is the user ID or you have another way to get it
    // You might need to adjust this based on your token structure

    // If token is just the user ID:
    return token;

    // If token is a JWT, you would decode it:
    // const payload = JSON.parse(atob(token.split('.')[1]));
    // return payload.userId || payload.sub;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// Hook for authentication with loading states and error handling
export const useAuthWithStatus = () => {
  const { isLoggedIn, isLoading } = useIsLoggedIn();
  const token = getAuthToken();
  const userId = useCurrentUserId();

  return {
    isLoggedIn,
    isLoading,
    token,
    userId,
    isAuthenticated: isLoggedIn && !!token,
    hasValidToken: !!token,
  };
};

// Hook for handling authentication errors and token expiration
export const useAuthErrorHandler = () => {
  const navigate = useNavigate();

  const handleAuthError = useCallback(
    (error: any) => {
      // Check if error is related to authentication
      if (error?.status === 401 || error?.status === 403) {
        removeAuthToken();
        navigate('/');
        return true; // Indicates error was handled
      }
      return false; // Indicates error was not handled
    },
    [navigate]
  );

  return { handleAuthError };
};

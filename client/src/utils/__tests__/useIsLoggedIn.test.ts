import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useIsLoggedIn from '../useIsLoggedIn';
import { thesisDbApi } from '../../services/JamDB';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock the API service
jest.mock('../../services/JamDB', () => ({
  ...jest.requireActual('../../services/JamDB'),
  useGetMeQuery: jest.fn(),
}));

const mockUseGetMeQuery = jest.mocked(thesisDbApi.useGetMeQuery as any);

const createTestStore = () => {
  return configureStore({
    reducer: {
      [thesisDbApi.reducerPath]: thesisDbApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thesisDbApi.middleware),
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useIsLoggedIn Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('should return false when no token exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return false when token exists but API call fails', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { status: 401, message: 'Unauthorized' },
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return true when token exists and API call succeeds', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          userId: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return loading state when API call is in progress', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('should not make API call when no token exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Mock that API should be skipped
    mockUseGetMeQuery.mockImplementation((_, options) => {
      expect(options?.skip).toBe(true);
      return {
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      };
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(mockUseGetMeQuery).toHaveBeenCalledWith(undefined, { skip: true });
  });

  it('should make API call when token exists', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    
    mockUseGetMeQuery.mockImplementation((_, options) => {
      expect(options?.skip).toBe(false);
      return {
        data: {
          success: true,
          data: { userId: 'user1', name: 'John Doe' },
        },
        isLoading: false,
        isError: false,
        error: null,
      };
    });

    renderHook(() => useIsLoggedIn(), { wrapper });

    expect(mockUseGetMeQuery).toHaveBeenCalledWith(undefined, { skip: false });
  });

  it('should handle token with quotes and spaces', () => {
    mockLocalStorage.getItem.mockReturnValue(' "jwt-token-123" ');
    mockUseGetMeQuery.mockReturnValue({
      data: {
        success: true,
        data: { userId: 'user1', name: 'John Doe' },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(true);
    expect(mockUseGetMeQuery).toHaveBeenCalledWith(undefined, { skip: false });
  });

  it('should handle API response without success field', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: {
        data: {
          userId: 'user1',
          name: 'John Doe',
        },
        // No success field
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('should handle API response with success: false', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: {
        success: false,
        message: 'Token expired',
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
  });

  it('should handle different error status codes', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');

    // Test 401 Unauthorized
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { status: 401 },
    });

    let { result } = renderHook(() => useIsLoggedIn(), { wrapper });
    expect(result.current.isLoggedIn).toBe(false);

    // Test 403 Forbidden
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { status: 403 },
    });

    ({ result } = renderHook(() => useIsLoggedIn(), { wrapper }));
    expect(result.current.isLoggedIn).toBe(false);

    // Test 500 Server Error (should still be false but different handling)
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { status: 500 },
    });

    ({ result } = renderHook(() => useIsLoggedIn(), { wrapper }));
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('should return user data when logged in', () => {
    const mockUserData = {
      userId: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      profilePic: 'https://example.com/profile.jpg',
    };

    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: {
        success: true,
        data: mockUserData,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user).toEqual(mockUserData);
  });

  it('should return null user data when not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle localStorage access errors', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage access denied');
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should update when token changes', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result, rerender } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);

    // Simulate token being set
    mockLocalStorage.getItem.mockReturnValue('new-jwt-token');
    mockUseGetMeQuery.mockReturnValue({
      data: {
        success: true,
        data: { userId: 'user1', name: 'John Doe' },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    rerender();

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('should handle network errors gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { name: 'NetworkError', message: 'Failed to fetch' },
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should provide error information when API fails', () => {
    const mockError = { status: 401, message: 'Unauthorized' };
    
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: mockError,
    });

    const { result } = renderHook(() => useIsLoggedIn(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });
});
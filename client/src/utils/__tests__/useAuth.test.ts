import { renderHook, act } from '@testing-library/react';
import useAuth from '../useAuth';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when no token exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBeNull();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('should return token when it exists in localStorage', () => {
    const mockToken = 'jwt-token-123';
    mockLocalStorage.getItem.mockReturnValue(mockToken);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(mockToken);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('should return cleaned token without quotes', () => {
    const tokenWithQuotes = '"jwt-token-123"';
    const expectedCleanToken = 'jwt-token-123';
    mockLocalStorage.getItem.mockReturnValue(tokenWithQuotes);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(expectedCleanToken);
  });

  it('should return cleaned token without spaces', () => {
    const tokenWithSpaces = '  jwt-token-123  ';
    const expectedCleanToken = 'jwt-token-123';
    mockLocalStorage.getItem.mockReturnValue(tokenWithSpaces);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(expectedCleanToken);
  });

  it('should return cleaned token without quotes and spaces', () => {
    const tokenWithQuotesAndSpaces = ' "jwt-token-123" ';
    const expectedCleanToken = 'jwt-token-123';
    mockLocalStorage.getItem.mockReturnValue(tokenWithQuotesAndSpaces);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(expectedCleanToken);
  });

  it('should handle empty string token', () => {
    mockLocalStorage.getItem.mockReturnValue('');

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe('');
  });

  it('should handle token with only quotes', () => {
    mockLocalStorage.getItem.mockReturnValue('""');

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe('');
  });

  it('should handle token with only spaces', () => {
    mockLocalStorage.getItem.mockReturnValue('   ');

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe('');
  });

  it('should handle single quotes', () => {
    const tokenWithSingleQuotes = "'jwt-token-123'";
    const expectedCleanToken = 'jwt-token-123';
    mockLocalStorage.getItem.mockReturnValue(tokenWithSingleQuotes);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(expectedCleanToken);
  });

  it('should handle mixed quotes', () => {
    const tokenWithMixedQuotes = '"jwt-token-123\'';
    const expectedCleanToken = 'jwt-token-123';
    mockLocalStorage.getItem.mockReturnValue(tokenWithMixedQuotes);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(expectedCleanToken);
  });

  it('should update when localStorage changes', () => {
    mockLocalStorage.getItem.mockReturnValue('initial-token');

    const { result, rerender } = renderHook(() => useAuth());

    expect(result.current).toBe('initial-token');

    // Simulate localStorage change
    mockLocalStorage.getItem.mockReturnValue('updated-token');
    
    rerender();

    expect(result.current).toBe('updated-token');
  });

  it('should handle null after having a token', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');

    const { result, rerender } = renderHook(() => useAuth());

    expect(result.current).toBe('jwt-token-123');

    // Simulate token removal
    mockLocalStorage.getItem.mockReturnValue(null);
    
    rerender();

    expect(result.current).toBeNull();
  });

  it('should handle localStorage access errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage access denied');
    });

    const { result } = renderHook(() => useAuth());

    // Should return null when localStorage throws error
    expect(result.current).toBeNull();
  });

  it('should not call localStorage on every render unnecessarily', () => {
    mockLocalStorage.getItem.mockReturnValue('jwt-token-123');

    const { rerender } = renderHook(() => useAuth());

    const initialCallCount = mockLocalStorage.getItem.mock.calls.length;

    rerender();
    rerender();
    rerender();

    // Should not increase calls significantly
    expect(mockLocalStorage.getItem.mock.calls.length).toBe(initialCallCount);
  });

  it('should handle special characters in token', () => {
    const tokenWithSpecialChars = 'jwt.token-123_abc@domain.com';
    mockLocalStorage.getItem.mockReturnValue(tokenWithSpecialChars);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(tokenWithSpecialChars);
  });

  it('should handle very long tokens', () => {
    const longToken = 'a'.repeat(1000);
    mockLocalStorage.getItem.mockReturnValue(longToken);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toBe(longToken);
  });

  it('should handle tokens with internal quotes', () => {
    const tokenWithInternalQuotes = 'jwt"token"123';
    mockLocalStorage.getItem.mockReturnValue(`"${tokenWithInternalQuotes}"`);

    const { result } = renderHook(() => useAuth());

    // Should only remove outer quotes
    expect(result.current).toBe(tokenWithInternalQuotes);
  });
});
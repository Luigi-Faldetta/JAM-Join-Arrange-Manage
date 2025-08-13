import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { thesisDbApi } from '../../services/JamDB';
import eventsReducer, { EventState } from '../../reduxFiles/slices/events';
import logoutReducer from '../../reduxFiles/slices/logout';
import authModalReducer from '../../reduxFiles/slices/authModal';
import usersReducer from '../../reduxFiles/slices/users';
import toDosReducer from '../../reduxFiles/slices/toDos';
import expensesReducer from '../../reduxFiles/slices/expenses';
import msgReducer from '../../reduxFiles/slices/msg';
import chatReducer from '../../reduxFiles/slices/chat';
import { RootState } from '../../reduxFiles/store';

// Create a test store
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      eventListReducer: eventsReducer,
      logoutReducer: logoutReducer,
      authModalReducer: authModalReducer,
      userListReducer: usersReducer,
      toDoListReducer: toDosReducer,
      expenseListReducer: expensesReducer,
      msgListReducer: msgReducer,
      chatReducer: chatReducer,
      [thesisDbApi.reducerPath]: thesisDbApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            // Ignore RTK Query actions
            thesisDbApi.util.resetApiState.type,
          ],
        },
      }).concat(thesisDbApi.middleware),
  });
}

export type AppStore = ReturnType<typeof setupStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  withRouter?: boolean;
  routerProps?: {
    initialEntries?: string[];
    initialIndex?: number;
  };
}

// Custom render function that includes providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    withRouter = true,
    routerProps = {},
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = <Provider store={store}>{children}</Provider>;
    
    if (withRouter) {
      return (
        <BrowserRouter {...routerProps}>
          {content}
        </BrowserRouter>
      );
    }
    
    return content;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock data factories for tests
export const createMockUser = (overrides = {}) => ({
  userId: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  profilePic: 'https://example.com/profile.jpg',
  ...overrides,
});

export const createMockEvent = (overrides = {}): EventState => ({
  eventId: 'event1',
  title: 'Test Event',
  description: 'Test event description',
  date: new Date('2025-08-15T18:00:00'),
  location: 'Test Location',
  coverPic: 'https://example.com/event.jpg',
  hostId: 'user1',
  UserEvents: [
    {
      userId: 'user1',
      isHost: true,
      isGoing: true,
    },
  ],
  ...overrides,
});

export const createMockTodo = (overrides = {}) => ({
  id: 'todo1',
  title: 'Test Todo',
  isDone: false,
  eventId: 'event1',
  creatorId: 'user1',
  ...overrides,
});

export const createMockExpense = (overrides = {}) => ({
  id: 'expense1',
  item: 'Test Expense',
  cost: 50.0,
  eventId: 'event1',
  purchaserId: 'user1',
  ...overrides,
});

// Mock API response factory
export const createMockApiResponse = <T>(data: T, overrides = {}) => ({
  success: true,
  data,
  message: 'Success',
  ...overrides,
});

// Common test utilities
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock local storage for tests
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get store() {
      return { ...store };
    },
  };
};

// Mock fetch helper
export const mockFetch = (response: any, options: { ok?: boolean; status?: number } = {}) => {
  return jest.fn().mockResolvedValue({
    ok: options.ok !== false,
    status: options.status || 200,
    json: async () => response,
  });
};

// Mock file for file upload tests
export const createMockFile = (name = 'test.jpg', type = 'image/jpeg') => {
  return new File(['test content'], name, { type });
};

// Date utilities for tests
export const createFutureDate = (daysFromNow = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

export const createPastDate = (daysAgo = 7) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Form interaction helpers
export const fillForm = (form: { [key: string]: HTMLElement }, values: { [key: string]: string }) => {
  Object.keys(values).forEach(key => {
    const input = form[key] as HTMLInputElement;
    if (input) {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = values[key] === 'true';
      } else {
        input.value = values[key];
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
};

// Assertion helpers
export const expectElementToHaveClasses = (element: HTMLElement, classes: string[]) => {
  classes.forEach(className => {
    expect(element).toHaveClass(className);
  });
};

export const expectElementToNotHaveClasses = (element: HTMLElement, classes: string[]) => {
  classes.forEach(className => {
    expect(element).not.toHaveClass(className);
  });
};

// Error boundary for testing error scenarios
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Re-export everything from RTL
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

// Default export with custom render
export { renderWithProviders as render };
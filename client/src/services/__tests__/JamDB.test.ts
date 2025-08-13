import { configureStore } from '@reduxjs/toolkit';
import { thesisDbApi } from '../JamDB';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mock-token'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const createTestStore = () => {
  return configureStore({
    reducer: {
      [thesisDbApi.reducerPath]: thesisDbApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thesisDbApi.middleware),
  });
};

describe('JAM API Service', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Clear any pending API calls
    store.dispatch(thesisDbApi.util.resetApiState());
  });

  describe('Authentication Endpoints', () => {
    it('should handle getMe query', async () => {
      const mockUserResponse = {
        success: true,
        data: {
          userId: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserResponse,
      } as Response);

      const result = await store.dispatch(thesisDbApi.endpoints.getMe.initiate());

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token',
          }),
        })
      );

      expect(result.data).toEqual(mockUserResponse);
    });

    it('should handle login mutation', async () => {
      const mockLoginResponse = {
        success: true,
        data: 'jwt-token',
        message: 'Login successful',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLoginResponse,
      } as Response);

      const loginData = { email: 'john@example.com', password: 'password123' };
      const result = await store.dispatch(
        thesisDbApi.endpoints.logIn.initiate(loginData)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/userlogin'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(loginData),
          headers: expect.objectContaining({
            'Content-type': 'application/json; charset=UTF-8',
          }),
        })
      );

      expect(result.data).toEqual(mockLoginResponse);
    });

    it('should handle updateMe mutation', async () => {
      const mockUpdateResponse = {
        success: true,
        data: {
          userId: 'user1',
          name: 'John Updated',
          email: 'john.updated@example.com',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdateResponse,
      } as Response);

      const updateData = { name: 'John Updated', email: 'john.updated@example.com' };
      const result = await store.dispatch(
        thesisDbApi.endpoints.updateMe.initiate(updateData)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/me'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updateData),
        })
      );

      expect(result.data).toEqual(mockUpdateResponse);
    });
  });

  describe('Event Endpoints', () => {
    it('should handle addEvent mutation', async () => {
      const mockEventResponse = {
        success: true,
        data: {
          eventId: '1',
          title: 'Test Event',
          description: 'Test Description',
          date: '2025-08-15T18:00:00Z',
          location: 'Test Location',
          hostId: 'user1',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventResponse,
      } as Response);

      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        date: new Date('2025-08-15T18:00:00Z'),
        location: 'Test Location',
        userId: 'user1',
      };

      const result = await store.dispatch(
        thesisDbApi.endpoints.addEvent.initiate(eventData)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/newevent/user1'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            location: eventData.location,
          }),
        })
      );

      expect(result.data).toEqual(mockEventResponse);
    });

    it('should handle getEvents query', async () => {
      const mockEventsResponse = {
        success: true,
        data: [
          {
            eventId: '1',
            title: 'Event 1',
            hostId: 'user1',
          },
          {
            eventId: '2',
            title: 'Event 2',
            hostId: 'user1',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsResponse,
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.getEvents.initiate('user1')
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/events/user1'),
        expect.any(Object)
      );

      expect(result.data).toEqual(mockEventsResponse);
    });

    it('should handle getEvent query', async () => {
      const mockEventResponse = {
        success: true,
        data: {
          eventId: '1',
          title: 'Single Event',
          hostId: 'user1',
          UserEvents: [],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventResponse,
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.getEvent.initiate('1')
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/event/1'),
        expect.any(Object)
      );

      expect(result.data).toEqual(mockEventResponse);
    });

    it('should handle updateEvent mutation', async () => {
      const mockUpdateResponse = {
        success: true,
        data: {
          eventId: '1',
          title: 'Updated Event Title',
          description: 'Updated Description',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdateResponse,
      } as Response);

      const updateData = {
        eventId: '1',
        title: 'Updated Event Title',
        description: 'Updated Description',
      };

      const result = await store.dispatch(
        thesisDbApi.endpoints.updateEvent.initiate(updateData)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/event/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            title: updateData.title,
            description: updateData.description,
          }),
        })
      );

      expect(result.data).toEqual(mockUpdateResponse);
    });

    it('should handle deleteEvent mutation', async () => {
      const mockDeleteResponse = {
        success: true,
        data: 1,
        message: 'Event deleted',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeleteResponse,
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.deleteEvent.initiate('1')
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/event/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );

      expect(result.data).toEqual(mockDeleteResponse);
    });
  });

  describe('Todo Endpoints', () => {
    it('should handle createTodo mutation', async () => {
      const mockTodoResponse = {
        success: true,
        data: {
          id: '1',
          title: 'Test Todo',
          isDone: false,
          eventId: 'event1',
          creatorId: 'user1',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodoResponse,
      } as Response);

      const todoData = {
        eventId: 'event1',
        title: 'Test Todo',
        creatorId: 'user1',
      };

      const result = await store.dispatch(
        thesisDbApi.endpoints.createTodo.initiate(todoData)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/todo'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            eventId: todoData.eventId,
            title: todoData.title,
            isDone: false,
            creatorId: todoData.creatorId,
          }),
        })
      );

      expect(result.data).toEqual(mockTodoResponse);
    });

    it('should handle getTodos query', async () => {
      const mockTodosResponse = {
        success: true,
        data: [
          { id: '1', title: 'Todo 1', isDone: false },
          { id: '2', title: 'Todo 2', isDone: true },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodosResponse,
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.getTodos.initiate('event1')
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/event1'),
        expect.any(Object)
      );

      expect(result.data).toEqual(mockTodosResponse);
    });

    it('should handle updateTodo mutation with field transformation', async () => {
      const mockUpdateResponse = {
        success: true,
        data: {
          id: '1',
          title: 'Updated Todo',
          isDone: true,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdateResponse,
      } as Response);

      const updateData = {
        todoId: '1',
        task: 'Updated Todo',
        isCompleted: true,
      };

      const result = await store.dispatch(
        thesisDbApi.endpoints.updateTodo.initiate(updateData)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/todo/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            title: 'Updated Todo', // task transformed to title
            isDone: true, // isCompleted transformed to isDone
          }),
        })
      );

      expect(result.data).toEqual(mockUpdateResponse);
    });
  });

  describe('Expense Endpoints', () => {
    it('should handle createExpense mutation', async () => {
      const mockExpenseResponse = {
        success: true,
        data: {
          id: '1',
          item: 'Test Expense',
          cost: 50.00,
          eventId: 'event1',
          purchaserId: 'user1',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockExpenseResponse,
      } as Response);

      const expenseData = {
        eventId: 'event1',
        item: 'Test Expense',
        cost: 50.00,
        purchaserId: 'user1',
      };

      const result = await store.dispatch(
        thesisDbApi.endpoints.createExpense.initiate(expenseData)
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/expense'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(expenseData),
        })
      );

      expect(result.data).toEqual(mockExpenseResponse);
    });

    it('should handle getExpenses query', async () => {
      const mockExpensesResponse = {
        success: true,
        data: [
          { id: '1', item: 'Expense 1', cost: 25.00 },
          { id: '2', item: 'Expense 2', cost: 75.50 },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockExpensesResponse,
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.getExpenses.initiate('event1')
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/expenses/event1'),
        expect.any(Object)
      );

      expect(result.data).toEqual(mockExpensesResponse);
    });

    it('should handle calculateExpenses query', async () => {
      const mockCalculationResponse = {
        success: true,
        data: {
          totalExpenses: 150.00,
          perPersonCost: 25.00,
          breakdown: {},
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCalculationResponse,
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.calculateExpenses.initiate('event1')
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/calculate/event1'),
        expect.any(Object)
      );

      expect(result.data).toEqual(mockCalculationResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.getEvent.initiate('nonexistent')
      );

      expect(result.error).toBeDefined();
      expect(result.error).toMatchObject({
        status: 404,
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await store.dispatch(
        thesisDbApi.endpoints.getMe.initiate()
      );

      expect(result.error).toBeDefined();
      expect(result.error).toMatchObject({
        error: 'Network error',
      });
    });

    it('should suppress expected "No items found" errors', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'No expenses were found',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => mockErrorResponse,
      } as Response);

      const result = await store.dispatch(
        thesisDbApi.endpoints.getExpenses.initiate('event1')
      );

      // The error should still be returned but not logged to console
      expect(result.error).toBeDefined();
    });
  });

  describe('Cache Management', () => {
    it('should provide correct tags for caching', () => {
      const eventsEndpoint = thesisDbApi.endpoints.getEvents;
      const eventEndpoint = thesisDbApi.endpoints.getEvent;

      // Events query should provide 'EventState' tag
      expect(eventsEndpoint.providesTags).toEqual(['EventState']);

      // Single event query should provide specific tag
      const eventTags = eventEndpoint.providesTags?.(
        { data: { eventId: '1' } },
        null,
        '1'
      );
      expect(eventTags).toEqual([{ type: 'EventState', id: '1' }]);
    });

    it('should invalidate correct tags on mutations', () => {
      const addEventEndpoint = thesisDbApi.endpoints.addEvent;
      const updateEventEndpoint = thesisDbApi.endpoints.updateEvent;
      const deleteEventEndpoint = thesisDbApi.endpoints.deleteEvent;

      expect(addEventEndpoint.invalidatesTags).toEqual(['EventState']);
      expect(deleteEventEndpoint.invalidatesTags).toEqual(['EventState']);

      // Update should invalidate both general and specific tags
      const updateTags = updateEventEndpoint.invalidatesTags?.(
        { data: { eventId: '1' } },
        null,
        { eventId: '1', title: 'Updated' }
      );
      expect(updateTags).toEqual([
        { type: 'EventState', id: '1' },
        'EventState',
      ]);
    });
  });

  describe('Request Headers and Authentication', () => {
    it('should include authorization header when token exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await store.dispatch(thesisDbApi.endpoints.getMe.initiate());

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'authorization': 'Bearer mock-token',
          }),
        })
      );
    });

    it('should handle requests without token', async () => {
      // Mock localStorage to return null
      (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await store.dispatch(thesisDbApi.endpoints.getMe.initiate());

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'authorization': expect.any(String),
          }),
        })
      );
    });

    it('should clean token with quotes and spaces', async () => {
      // Mock localStorage to return token with quotes and spaces
      (window.localStorage.getItem as jest.Mock).mockReturnValueOnce('" token-with-quotes "');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      await store.dispatch(thesisDbApi.endpoints.getMe.initiate());

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'authorization': 'Bearer token-with-quotes',
          }),
        })
      );
    });
  });
});
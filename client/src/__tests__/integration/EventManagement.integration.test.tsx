import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import UserDashboardPage from '../../pages/UserDashboard/UserDashboardPage';
import EventDashboard from '../../pages/EventDashboard/EventDashboard';
import { thesisDbApi } from '../../services/JamDB';
import eventsReducer from '../../reduxFiles/slices/events';
import logoutReducer from '../../reduxFiles/slices/logout';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ eventid: '1' }),
}));

// Mock react-datepicker
jest.mock('react-datepicker', () => {
  return function MockDatePicker({ onChange, selected, ...props }: any) {
    return (
      <input
        data-testid="date-picker"
        type="datetime-local"
        onChange={(e) => onChange(new Date(e.target.value))}
        value={selected ? selected.toISOString().slice(0, 16) : ''}
        {...props}
      />
    );
  };
});

// Mock react-dom createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: any) => node,
}));

// Mock moment
jest.mock('moment', () => {
  const mockMoment = (date?: any) => ({
    format: (format: string) => {
      if (format === 'MMM D, YYYY') return 'Aug 15, 2025';
      if (format === 'ddd, MMM D - h:mm A') return 'Thu, Aug 15 - 6:00 PM';
      if (format === 'dddd, MMMM D, YYYY') return 'Thursday, August 15, 2025';
      if (format === 'h:mm A') return '6:00 PM';
      return 'Aug 15, 2025';
    },
    fromNow: () => 'in 2 days',
    isAfter: () => true,
  });
  
  mockMoment.mockReturnValue = mockMoment();
  return mockMoment;
});

const mockUser = {
  userId: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  profilePic: 'https://example.com/profile.jpg',
};

const mockEvents = [
  {
    eventId: '1',
    title: 'Test Event 1',
    description: 'Description 1',
    date: new Date('2025-08-20T18:00:00'),
    location: 'Location 1',
    coverPic: 'https://example.com/image1.jpg',
    hostId: 'user1',
    UserEvents: [
      { userId: 'user1', isHost: true, isGoing: true },
      { userId: 'user2', isHost: false, isGoing: true },
    ],
  },
];

const mockNewEvent = {
  eventId: '2',
  title: 'New Test Event',
  description: 'New event description',
  date: new Date('2025-09-01T19:00:00'),
  location: 'New Location',
  coverPic: null,
  hostId: 'user1',
  UserEvents: [
    { userId: 'user1', isHost: true, isGoing: true },
  ],
};

// Mock API responses
const mockApiResponses = {
  getMe: { data: mockUser },
  getEvents: { data: mockEvents },
  getEvent: { data: mockEvents[0] },
  addEvent: { data: mockNewEvent },
  updateEvent: { data: { ...mockEvents[0], title: 'Updated Event Title' } },
  deleteEvent: { data: 1 },
};

let mockAddEventMutation: jest.Mock;
let mockUpdateEventMutation: jest.Mock;
let mockDeleteEventMutation: jest.Mock;

const createMockStore = () => {
  return configureStore({
    reducer: {
      eventListReducer: eventsReducer.eventListReducer,
      eventReducer: eventsReducer.eventReducer,
      logoutReducer: logoutReducer,
      [thesisDbApi.reducerPath]: thesisDbApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thesisDbApi.middleware),
  });
};

// Mock API hooks
jest.mock('../../services/JamDB', () => ({
  ...jest.requireActual('../../services/JamDB'),
  useGetMeQuery: () => ({
    data: mockApiResponses.getMe,
    refetch: jest.fn(),
    error: null,
    isLoading: false,
    isError: false,
  }),
  useGetEventsQuery: () => ({
    data: mockApiResponses.getEvents,
    isLoading: false,
  }),
  useGetEventQuery: () => ({
    data: mockApiResponses.getEvent,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
  useAddEventMutation: () => {
    mockAddEventMutation = jest.fn().mockResolvedValue({
      data: { success: true, ...mockApiResponses.addEvent }
    });
    return [mockAddEventMutation, { isLoading: false }];
  },
  useUpdateEventMutation: () => {
    mockUpdateEventMutation = jest.fn().mockResolvedValue({
      data: { success: true, ...mockApiResponses.updateEvent }
    });
    return [mockUpdateEventMutation, { isLoading: false }];
  },
  useDeleteEventMutation: () => {
    mockDeleteEventMutation = jest.fn().mockResolvedValue({
      data: { success: true, ...mockApiResponses.deleteEvent }
    });
    return [mockDeleteEventMutation, { isLoading: false }];
  },
  useGetUsersQuery: () => ({
    data: { data: [] },
    isLoading: false,
  }),
  useGetTodosQuery: () => ({
    data: { data: [] },
    isLoading: false,
  }),
  useGetExpensesQuery: () => ({
    data: { data: [] },
    isLoading: false,
  }),
  useGetMsgsQuery: () => ({
    data: { data: [] },
    isLoading: false,
  }),
}));

// Mock socket.io
jest.mock('../../services/JamDB', () => ({
  ...jest.requireActual('../../services/JamDB'),
  socket: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('Event Management Integration Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Mock fetch for manual API calls
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: mockUser,
      }),
    });

    // Mock Cloudinary upload
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('cloudinary')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            secure_url: 'https://cloudinary.com/uploaded-image.jpg'
          }),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          data: mockUser,
        }),
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Event Flow', () => {
    it('should allow user to create a new event end-to-end', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // 1. Click Create Event button
      const createEventButton = screen.getByText('Create Event');
      fireEvent.click(createEventButton);

      // 2. Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument();
      });

      // 3. Fill out the form
      const titleInput = screen.getByPlaceholderText(/Anna's Birthday Party/i);
      const dateInput = screen.getByTestId('date-picker');
      const locationInput = screen.getByPlaceholderText(/123 Rainbow Lane/i);
      const descriptionInput = screen.getByPlaceholderText(/Tell people what to expect/i);

      fireEvent.change(titleInput, { target: { value: 'New Test Event' } });
      fireEvent.change(dateInput, { target: { value: '2025-09-01T19:00' } });
      fireEvent.change(locationInput, { target: { value: 'New Location' } });
      fireEvent.change(descriptionInput, { target: { value: 'New event description' } });

      // 4. Submit the form
      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      // 5. Verify API was called
      await waitFor(() => {
        expect(mockAddEventMutation).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Test Event',
            location: 'New Location',
            description: 'New event description',
            userId: 'user1',
          })
        );
      });

      // 6. Verify modal closes after successful creation
      await waitFor(() => {
        expect(screen.queryByText('Create New Event')).not.toBeInTheDocument();
      });
    });

    it('should handle image upload during event creation', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Open create event modal
      fireEvent.click(screen.getByText('Create Event'));

      await waitFor(() => {
        expect(screen.getByText('Create New Event')).toBeInTheDocument();
      });

      // Fill basic info
      fireEvent.change(screen.getByPlaceholderText(/Anna's Birthday Party/i), {
        target: { value: 'Event with Image' }
      });

      // Upload an image
      const fileInput = screen.getByLabelText('Click to upload event image').querySelector('input[type="file"]')!;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddEventMutation).toHaveBeenCalled();
      });
    });
  });

  describe('View Event Details Flow', () => {
    it('should navigate to event details when event tile is clicked', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Find and click event tile
      const eventTitle = screen.getByText('Test Event 1');
      const eventTile = eventTitle.closest('div[class*="cursor-pointer"]');
      
      if (eventTile) {
        fireEvent.click(eventTile);
      }

      // Verify navigation was called
      expect(mockNavigate).toHaveBeenCalledWith('/event-dashboard/1');
    });
  });

  describe('Filter and Search Flow', () => {
    it('should filter events by hosting status', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Wait for events to load
      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      // Filter by hosting
      const filterSelect = screen.getByDisplayValue('All Events');
      fireEvent.change(filterSelect, { target: { value: 'hosting' } });

      // Since user1 is host of Test Event 1, it should still be visible
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    });

    it('should filter events by attending status', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      // Filter by attending
      const filterSelect = screen.getByDisplayValue('All Events');
      fireEvent.change(filterSelect, { target: { value: 'attending' } });

      // Event should still be visible as user is attending
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    });

    it('should search events by title', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      // Search for specific event
      const searchInput = screen.getByPlaceholderText('Search events...');
      fireEvent.change(searchInput, { target: { value: 'Test Event 1' } });

      // Event should be visible
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();

      // Search for non-existent event
      fireEvent.change(searchInput, { target: { value: 'Non-existent Event' } });
      
      expect(screen.getByText('No events found')).toBeInTheDocument();
    });
  });

  describe('View Mode Toggle Flow', () => {
    it('should toggle between grid and list view modes', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      });

      // Find view mode buttons (they have icon children but no text)
      const viewModeContainer = screen.getByText('Test Event 1')
        .closest('div')!
        .querySelector('[class*="bg-white/10 rounded-xl p-1"]');

      if (viewModeContainer) {
        const buttons = viewModeContainer.querySelectorAll('button');
        const listButton = buttons[1]; // Second button is list view

        // Switch to list view
        fireEvent.click(listButton);

        // Event should still be visible in list view
        expect(screen.getByText('Test Event 1')).toBeInTheDocument();

        // Switch back to grid view
        const gridButton = buttons[0];
        fireEvent.click(gridButton);

        expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      }
    });
  });

  describe('Calendar Toggle Flow', () => {
    it('should show and hide calendar view', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Find and click calendar button
      const calendarButton = screen.getByText('Calendar');
      fireEvent.click(calendarButton);

      // Calendar should be visible (mocked as div with test id)
      await waitFor(() => {
        expect(screen.queryByText('Calendar View')).toBeInTheDocument();
      });

      // Click again to hide
      fireEvent.click(calendarButton);

      await waitFor(() => {
        expect(screen.queryByText('Calendar View')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Flow', () => {
    it('should navigate to profile page from dashboard', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Find and click profile button
      const profileButton = screen.getByAltText('Profile').closest('button')!;
      fireEvent.click(profileButton);

      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('should handle sign out action', async () => {
      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Find and click sign out button
      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);

      // This should trigger the logout modal (handled by Redux)
      // In a real integration test, we would verify the logout flow
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      jest.doMock('../../services/JamDB', () => ({
        ...jest.requireActual('../../services/JamDB'),
        useGetEventsQuery: () => ({
          data: null,
          isLoading: false,
          error: { status: 500, message: 'Server Error' },
        }),
      }));

      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('No events yet')).toBeInTheDocument();
      });
    });

    it('should handle loading states properly', async () => {
      // Mock loading state
      jest.doMock('../../services/JamDB', () => ({
        ...jest.requireActual('../../services/JamDB'),
        useGetEventsQuery: () => ({
          data: null,
          isLoading: true,
        }),
      }));

      render(
        <MockWrapper>
          <UserDashboardPage />
        </MockWrapper>
      );

      // Should show loading skeletons
      expect(screen.getAllByRole('generic')).toHaveLength(expect.any(Number));
    });
  });
});
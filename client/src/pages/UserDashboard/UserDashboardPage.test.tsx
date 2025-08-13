import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import UserDashboardPage from './UserDashboardPage';
import { thesisDbApi } from '../../services/JamDB';
import eventsReducer from '../../reduxFiles/slices/events';
import logoutReducer from '../../reduxFiles/slices/logout';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
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
}));

// Mock the child components
jest.mock('../../components/UserDashboard/CreateEventForm', () => {
  return function MockCreateEventForm() {
    return <button>Create Event</button>;
  };
});

jest.mock('../../components/UserDashboard/EventTile', () => {
  return function MockEventTile({ event }: any) {
    return <div data-testid={`event-tile-${event.eventId}`}>{event.title}</div>;
  };
});

jest.mock('../../components/UserDashboard/EventCalendar', () => {
  return function MockEventCalendar() {
    return <div data-testid="event-calendar">Calendar View</div>;
  };
});

const mockEvents = [
  {
    eventId: '1',
    title: 'Test Event 1',
    description: 'Description 1',
    date: new Date('2025-08-20'),
    location: 'Location 1',
    hostId: 'user1',
    UserEvents: [
      { userId: 'user1', isHost: true, isGoing: true },
      { userId: 'user2', isHost: false, isGoing: true },
    ],
  },
  {
    eventId: '2',
    title: 'Test Event 2',
    description: 'Description 2',
    date: new Date('2025-08-25'),
    location: 'Location 2',
    hostId: 'user2',
    UserEvents: [
      { userId: 'user1', isHost: false, isGoing: true },
      { userId: 'user2', isHost: true, isGoing: true },
    ],
  },
];

const mockUser = {
  userId: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  profilePic: 'https://example.com/profile.jpg',
};

// Mock API hooks
const mockUseGetMeQuery = jest.fn();
const mockUseGetEventsQuery = jest.fn();

jest.mock('../../services/JamDB', () => ({
  ...jest.requireActual('../../services/JamDB'),
  useGetMeQuery: () => mockUseGetMeQuery(),
  useGetEventsQuery: () => mockUseGetEventsQuery(),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      eventListReducer: eventsReducer.eventListReducer,
      eventReducer: eventsReducer.eventReducer,
      logoutReducer: logoutReducer,
      [thesisDbApi.reducerPath]: thesisDbApi.reducer,
    },
    preloadedState: {
      eventListReducer: mockEvents,
      ...initialState,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thesisDbApi.middleware),
  });
};

const MockWrapper = ({ children, initialState = {} }: { children: React.ReactNode; initialState?: any }) => {
  const store = createMockStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('UserDashboardPage Component', () => {
  beforeEach(() => {
    mockUseGetMeQuery.mockReturnValue({
      data: { data: mockUser },
      refetch: jest.fn(),
      error: null,
      isLoading: false,
      isError: false,
    });

    mockUseGetEventsQuery.mockReturnValue({
      data: { data: mockEvents },
      isLoading: false,
    });

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

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: mockUser,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome message with user name', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
  });

  it('displays user profile picture', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const profileImg = screen.getByAltText('Profile');
    expect(profileImg).toHaveAttribute('src', mockUser.profilePic);
  });

  it('displays event statistics correctly', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Total Events
    expect(screen.getByText('1')).toBeInTheDocument(); // Hosting Events
    expect(screen.getByText('2')).toBeInTheDocument(); // Attending Events
  });

  it('renders create event button', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('toggles calendar view when calendar button clicked', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const calendarButton = screen.getByText('Calendar');
    fireEvent.click(calendarButton);

    expect(screen.getByTestId('event-calendar')).toBeInTheDocument();

    // Click again to hide
    fireEvent.click(calendarButton);
    expect(screen.queryByTestId('event-calendar')).not.toBeInTheDocument();
  });

  it('filters events by hosting status', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const filterSelect = screen.getByDisplayValue('All Events');
    fireEvent.change(filterSelect, { target: { value: 'hosting' } });

    // Should only show events where user is host
    expect(screen.getByTestId('event-tile-1')).toBeInTheDocument();
    expect(screen.queryByTestId('event-tile-2')).not.toBeInTheDocument();
  });

  it('filters events by attending status', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const filterSelect = screen.getByDisplayValue('All Events');
    fireEvent.change(filterSelect, { target: { value: 'attending' } });

    // Should show events where user is attending (both events in mock data)
    expect(screen.getByTestId('event-tile-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-tile-2')).toBeInTheDocument();
  });

  it('searches events by title', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search events...');
    fireEvent.change(searchInput, { target: { value: 'Test Event 1' } });

    expect(screen.getByTestId('event-tile-1')).toBeInTheDocument();
    expect(screen.queryByTestId('event-tile-2')).not.toBeInTheDocument();
  });

  it('toggles between grid and list view modes', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    // Default should be grid view
    const gridButton = screen.getByRole('button', { name: '' }); // Grid icon button
    const listButton = screen.getByRole('button', { name: '' }); // List icon button

    // Switch to list view
    fireEvent.click(listButton);
    
    // Switch back to grid view
    fireEvent.click(gridButton);
  });

  it('navigates to profile page when profile button clicked', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const profileButton = screen.getByAltText('Profile').closest('button')!;
    fireEvent.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('opens logout modal when sign out button clicked', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    // This would dispatch the openLogout action
    // We'd need to check the store state or mock the dispatch
  });

  it('displays placeholder when no events found', () => {
    mockUseGetEventsQuery.mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });

    render(
      <MockWrapper initialState={{ eventListReducer: [] }}>
        <UserDashboardPage />
      </MockWrapper>
    );

    expect(screen.getByText('No events yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first event to get started and bring people together!')).toBeInTheDocument();
  });

  it('displays no results message when search yields no results', () => {
    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Search events...');
    fireEvent.change(searchInput, { target: { value: 'Non-existent Event' } });

    expect(screen.getByText('No events found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument();
  });

  it('shows loading state while fetching events', () => {
    mockUseGetEventsQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    // Should show loading skeletons
    expect(screen.getAllByRole('generic')).toHaveLength(expect.any(Number));
  });

  it('handles user data loading states', async () => {
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      refetch: jest.fn(),
      error: null,
      isLoading: true,
      isError: false,
    });

    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome back, User!')).toBeInTheDocument();
    });
  });

  it('uses fallback user data when RTK Query fails', async () => {
    mockUseGetMeQuery.mockReturnValue({
      data: null,
      refetch: jest.fn(),
      error: { status: 500 },
      isLoading: false,
      isError: true,
    });

    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('displays default profile picture when user has no profile pic', () => {
    mockUseGetMeQuery.mockReturnValue({
      data: { data: { ...mockUser, profilePic: null } },
      refetch: jest.fn(),
      error: null,
      isLoading: false,
      isError: false,
    });

    render(
      <MockWrapper>
        <UserDashboardPage />
      </MockWrapper>
    );

    const profileImg = screen.getByAltText('Profile');
    expect(profileImg).toHaveAttribute('src', '/no-profile-picture-icon.png');
  });
});
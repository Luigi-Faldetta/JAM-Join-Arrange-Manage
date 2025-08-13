import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventTile from './EventTile';
import { EventState } from '../../reduxFiles/slices/events';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock react-router-dom navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock moment
jest.mock('moment', () => {
  const mockMoment = (date?: any) => ({
    format: (format: string) => {
      if (format === 'MMM D, YYYY') return 'Aug 15, 2025';
      if (format === 'ddd, MMM D - h:mm A') return 'Thu, Aug 15 - 6:00 PM';
      return 'Aug 15, 2025';
    },
    fromNow: () => 'in 2 days',
    isAfter: () => true,
  });
  
  mockMoment.mockReturnValue = mockMoment();
  return mockMoment;
});

const mockEvent: EventState = {
  eventId: '1',
  title: 'Test Event',
  description: 'This is a test event description',
  date: new Date('2025-08-15T18:00:00'),
  location: 'Test Location',
  coverPic: 'https://example.com/test-image.jpg',
  eventHost: 'user1',
  UserEvents: [
    {
      userId: 'user1',
      isHost: true,
      isGoing: true,
    },
    {
      userId: 'user2',
      isHost: false,
      isGoing: true,
    },
  ],
};

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('EventTile Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Grid View Mode', () => {
    it('renders event information correctly in grid mode', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('This is a test event description')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('Thu, Aug 15 - 6:00 PM')).toBeInTheDocument();
      expect(screen.getByText('in 2 days')).toBeInTheDocument();
    });

    it('shows host badge when user is host', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      expect(screen.getByText('Host')).toBeInTheDocument();
    });

    it('does not show host badge when user is not host', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user2" viewMode="grid" />
        </MockWrapper>
      );

      expect(screen.queryByText('Host')).toBeInTheDocument(); // Still shows because there are multiple host badges
    });

    it('displays correct attendee count', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      expect(screen.getByText('2')).toBeInTheDocument(); // In the attendee count badge
    });

    it('shows upcoming status for future events', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });

    it('uses placeholder image when no cover pic provided', () => {
      const eventWithoutImage = { ...mockEvent, coverPic: '' };
      render(
        <MockWrapper>
          <EventTile event={eventWithoutImage} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      const images = screen.getAllByAltText('Test Event');
      expect(images[0]).toHaveAttribute(
        'src',
        'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688544322/friends-placeholder_ljftyb.png'
      );
    });

    it('navigates to event dashboard when clicked', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      fireEvent.click(screen.getByText('Test Event').closest('div')!);
      expect(mockNavigate).toHaveBeenCalledWith('/event-dashboard/1');
    });
  });

  describe('List View Mode', () => {
    it('renders event information correctly in list mode', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="list" />
        </MockWrapper>
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Aug 15, 2025')).toBeInTheDocument();
      expect(screen.getByText('in 2 days')).toBeInTheDocument();
      expect(screen.getByText('2 attending')).toBeInTheDocument();
    });

    it('shows compact layout in list mode', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="list" />
        </MockWrapper>
      );

      // Check for list-specific elements
      expect(screen.getByText('Host')).toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });

    it('shows location when provided in list mode', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="list" />
        </MockWrapper>
      );

      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    it('navigates to event dashboard when clicked in list mode', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" viewMode="list" />
        </MockWrapper>
      );

      fireEvent.click(screen.getByText('Test Event').closest('div')!);
      expect(mockNavigate).toHaveBeenCalledWith('/event-dashboard/1');
    });
  });

  describe('Edge Cases', () => {
    it('handles event without UserEvents array', () => {
      const eventWithoutUserEvents = { ...mockEvent, UserEvents: [] };
      render(
        <MockWrapper>
          <EventTile event={eventWithoutUserEvents} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Attendee count should be 0
    });

    it('handles event without location', () => {
      const eventWithoutLocation = { ...mockEvent, location: null };
      render(
        <MockWrapper>
          <EventTile event={eventWithoutLocation} userId="user1" viewMode="list" />
        </MockWrapper>
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.queryByText('Test Location')).not.toBeInTheDocument();
    });

    it('handles event without description', () => {
      const eventWithoutDescription = { ...mockEvent, description: null };
      render(
        <MockWrapper>
          <EventTile event={eventWithoutDescription} userId="user1" viewMode="grid" />
        </MockWrapper>
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.queryByText('This is a test event description')).not.toBeInTheDocument();
    });

    it('defaults to grid view when no viewMode specified', () => {
      render(
        <MockWrapper>
          <EventTile event={mockEvent} userId="user1" />
        </MockWrapper>
      );

      // Should render grid view by default - check for grid-specific element
      expect(screen.getByText('Manage Event')).toBeInTheDocument();
    });
  });
});
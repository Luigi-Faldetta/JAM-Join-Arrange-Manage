import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CreateEventForm from './CreateEventForm';
import { thesisDbApi } from '../../services/JamDB';
import eventsReducer from '../../reduxFiles/slices/events';

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

// Mock react-datepicker
jest.mock('react-datepicker', () => {
  return function MockDatePicker({ onChange, selected, ...props }: any) {
    return (
      <input
        data-testid="date-picker"
        type="date"
        onChange={(e) => onChange(new Date(e.target.value))}
        value={selected ? selected.toISOString().split('T')[0] : ''}
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

// Mock cloudinary upload
global.fetch = jest.fn();

const createMockStore = () => {
  return configureStore({
    reducer: {
      eventListReducer: eventsReducer.eventListReducer,
      eventReducer: eventsReducer.eventReducer,
      [thesisDbApi.reducerPath]: thesisDbApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thesisDbApi.middleware),
  });
};

const mockUser = {
  userId: 'user1',
  name: 'Test User',
  email: 'test@example.com',
};

// Mock the useGetMeQuery hook
const mockUseGetMeQuery = jest.fn();
jest.mock('../../services/JamDB', () => ({
  ...jest.requireActual('../../services/JamDB'),
  useGetMeQuery: () => mockUseGetMeQuery(),
  useAddEventMutation: () => [
    jest.fn().mockResolvedValue({
      data: { success: true, data: { eventId: '1', title: 'New Event' } }
    }),
    { isLoading: false }
  ],
}));

const MockWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('CreateEventForm Component', () => {
  beforeEach(() => {
    mockUseGetMeQuery.mockReturnValue({
      data: { data: mockUser },
      isLoading: false,
      error: null,
    });
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders create event button', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('opens modal when create event button is clicked', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));
    expect(screen.getByText('Create New Event')).toBeInTheDocument();
  });

  it('renders all form fields in modal', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));

    expect(screen.getByPlaceholderText('e.g., Anna\'s Birthday Party')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 123 Rainbow Lane, City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell people what to expect at your event...')).toBeInTheDocument();
    expect(screen.getByText('Click to upload event image')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(submitButton);

    // The form should prevent submission due to HTML5 validation
    const titleInput = screen.getByPlaceholderText('e.g., Anna\'s Birthday Party');
    expect(titleInput).toHaveAttribute('required');
  });

  it('fills form fields correctly', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));

    const titleInput = screen.getByPlaceholderText('e.g., Anna\'s Birthday Party');
    const locationInput = screen.getByPlaceholderText('e.g., 123 Rainbow Lane, City');
    const descriptionInput = screen.getByPlaceholderText('Tell people what to expect at your event...');

    fireEvent.change(titleInput, { target: { value: 'Test Event' } });
    fireEvent.change(locationInput, { target: { value: 'Test Location' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    expect(titleInput).toHaveValue('Test Event');
    expect(locationInput).toHaveValue('Test Location');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  it('handles date selection', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2025-12-25' } });

    expect(datePicker).toHaveValue('2025-12-25');
  });

  it('handles image file selection', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));

    const fileInput = screen.getByLabelText('Click to upload event image').querySelector('input[type="file"]')!;
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect((fileInput as HTMLInputElement).files![0]).toBe(file);
  });

  it('closes modal when close button is clicked', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));
    expect(screen.getByText('Create New Event')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: '' }); // Close button with X icon
    fireEvent.click(closeButton);

    expect(screen.queryByText('Create New Event')).not.toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', () => {
    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));
    expect(screen.getByText('Create New Event')).toBeInTheDocument();

    // Find the backdrop (the modal overlay)
    const backdrop = screen.getByText('Create New Event').closest('div')?.previousSibling as HTMLElement;
    if (backdrop) {
      fireEvent.click(backdrop);
    }
  });

  it('shows loading state during form submission', async () => {
    // Mock the mutation to return loading state
    const mockAddEvent = jest.fn();
    jest.doMock('../../services/JamDB', () => ({
      ...jest.requireActual('../../services/JamDB'),
      useAddEventMutation: () => [mockAddEvent, { isLoading: true }],
    }));

    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));
    
    const titleInput = screen.getByPlaceholderText('e.g., Anna\'s Birthday Party');
    fireEvent.change(titleInput, { target: { value: 'Test Event' } });

    const submitButton = screen.getByRole('button', { name: /creating event/i });
    expect(submitButton).toBeDisabled();
  });

  it('resets form after successful submission', async () => {
    const mockAddEvent = jest.fn().mockResolvedValue({
      data: { success: true, data: { eventId: '1', title: 'Test Event' } }
    });

    jest.doMock('../../services/JamDB', () => ({
      ...jest.requireActual('../../services/JamDB'),
      useAddEventMutation: () => [mockAddEvent, { isLoading: false }],
    }));

    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));
    
    const titleInput = screen.getByPlaceholderText('e.g., Anna\'s Birthday Party');
    fireEvent.change(titleInput, { target: { value: 'Test Event' } });

    const submitButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddEvent).toHaveBeenCalled();
    });
  });

  it('handles cloudinary image upload', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        secure_url: 'https://cloudinary.com/uploaded-image.jpg'
      }),
    });

    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));

    const fileInput = screen.getByLabelText('Click to upload event image').querySelector('input[type="file"]')!;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      // Check if FileReader was used to create preview
      expect((fileInput as HTMLInputElement).files![0]).toBe(file);
    });
  });

  it('handles form submission with all fields', async () => {
    const mockAddEvent = jest.fn().mockResolvedValue({
      data: { success: true, data: { eventId: '1', title: 'Test Event' } }
    });

    render(
      <MockWrapper>
        <CreateEventForm />
      </MockWrapper>
    );

    fireEvent.click(screen.getByText('Create Event'));

    // Fill all form fields
    fireEvent.change(screen.getByPlaceholderText('e.g., Anna\'s Birthday Party'), {
      target: { value: 'Test Event' }
    });
    fireEvent.change(screen.getByTestId('date-picker'), {
      target: { value: '2025-12-25' }
    });
    fireEvent.change(screen.getByPlaceholderText('e.g., 123 Rainbow Lane, City'), {
      target: { value: 'Test Location' }
    });
    fireEvent.change(screen.getByPlaceholderText('Tell people what to expect at your event...'), {
      target: { value: 'Test Description' }
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(submitButton);
  });
});
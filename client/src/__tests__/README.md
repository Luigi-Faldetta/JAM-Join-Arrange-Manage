# JAM Frontend Testing Suite

This directory contains comprehensive unit and integration tests for the JAM (Join. Arrange. Manage.) frontend application.

## Test Structure

### 📁 **Unit Tests**
- **Components**: `components/UserDashboard/`
  - `EventTile.test.tsx` - Tests event card component rendering and interactions
  - `CreateEventForm.test.tsx` - Tests event creation form functionality

- **Pages**: `pages/UserDashboard/`
  - `UserDashboardPage.test.tsx` - Tests main dashboard page functionality

- **Redux Store**: `reduxFiles/slices/__tests__/`
  - `events.test.ts` - Tests event store actions and reducers

- **Services**: `services/__tests__/`
  - `JamDB.test.ts` - Tests RTK Query API service endpoints

- **Utils**: `utils/__tests__/`
  - `useAuth.test.ts` - Tests authentication hook
  - `useIsLoggedIn.test.ts` - Tests login status hook

### 📁 **Integration Tests**
- `__tests__/integration/EventManagement.integration.test.tsx` - End-to-end event management workflows

### 📁 **Test Utilities**
- `__tests__/utils/testUtils.tsx` - Custom render functions and mock factories
- `__tests__/setup/testSetup.ts` - Test environment configuration
- `setupTests.ts` - Jest setup and global mocks

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (default)
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test EventTile.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

## Test Coverage

The test suite covers:

- ✅ **Component Rendering**: All major components render correctly
- ✅ **User Interactions**: Form submissions, button clicks, navigation
- ✅ **State Management**: Redux actions, reducers, and RTK Query
- ✅ **API Integration**: Mock API calls and response handling
- ✅ **Error Handling**: Network errors, validation errors, loading states
- ✅ **Responsive Behavior**: Grid/list view modes, search, filtering
- ✅ **Authentication**: Login status, token handling, protected routes
- ✅ **Integration Workflows**: Complete user journeys

## Key Testing Patterns

### 1. **Component Testing**
```typescript
import { renderWithProviders } from '../../../__tests__/utils/testUtils';

test('renders event tile with correct information', () => {
  const mockEvent = createMockEvent({ title: 'Test Event' });
  
  renderWithProviders(
    <EventTile event={mockEvent} userId="user1" />
  );
  
  expect(screen.getByText('Test Event')).toBeInTheDocument();
});
```

### 2. **Redux Testing**
```typescript
import { setupStore } from '../../../__tests__/utils/testUtils';
import { addEvent } from '../events';

test('should handle addEvent action', () => {
  const store = setupStore();
  const mockEvent = createMockEvent();
  
  store.dispatch(addEvent(mockEvent));
  
  const state = store.getState();
  expect(state.eventListReducer).toContain(mockEvent);
});
```

### 3. **Integration Testing**
```typescript
test('complete event creation workflow', async () => {
  renderWithProviders(<UserDashboardPage />);
  
  // Click create event button
  fireEvent.click(screen.getByText('Create Event'));
  
  // Fill form
  fireEvent.change(screen.getByPlaceholderText(/event name/i), {
    target: { value: 'New Event' }
  });
  
  // Submit
  fireEvent.click(screen.getByRole('button', { name: /create/i }));
  
  // Verify API call
  await waitFor(() => {
    expect(mockAddEvent).toHaveBeenCalled();
  });
});
```

## Mocking Strategy

### Global Mocks (setupTests.ts)
- `IntersectionObserver`, `ResizeObserver`
- `matchMedia`, `scrollTo`
- `FileReader`, `URL.createObjectURL`
- Browser APIs and DOM methods

### Component-Specific Mocks
- `framer-motion` for animations
- `react-router-dom` for navigation
- `react-datepicker` for date selection
- Third-party libraries as needed

### API Mocking
- RTK Query endpoints mocked with realistic responses
- Error scenarios and loading states
- Authentication flows

## Test Data Factories

The test suite includes factories for creating mock data:

```typescript
// Create mock user
const user = createMockUser({ name: 'Jane Doe' });

// Create mock event
const event = createMockEvent({ 
  title: 'Birthday Party',
  date: createFutureDate(5) 
});

// Create mock API response
const response = createMockApiResponse(event);
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Test what users see and do
   - Avoid testing internal component state directly

2. **Use Realistic Test Data**
   - Mock data should resemble real application data
   - Include edge cases (null values, empty arrays)

3. **Test Error Scenarios**
   - Network failures, validation errors
   - Loading states, empty states

4. **Keep Tests Focused**
   - One assertion per test when possible
   - Clear test names describing expected behavior

5. **Use Custom Render Functions**
   - `renderWithProviders` sets up Redux and Router
   - Consistent test environment setup

## Continuous Integration

Tests are designed to:
- Run quickly in CI environments
- Be deterministic and reliable
- Provide clear failure messages
- Have minimal external dependencies

## Coverage Goals

Target coverage thresholds:
- **Lines**: 70%+
- **Functions**: 70%+
- **Branches**: 70%+
- **Statements**: 70%+

Focus on testing critical user paths and complex business logic rather than achieving 100% coverage.
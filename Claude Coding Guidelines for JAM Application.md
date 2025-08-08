# Claude Coding Guidelines for JAM Application

## Project Overview

This document provides comprehensive coding guidelines and best practices for the JAM (Join. Arrange. Manage.) application development. The JAM application is a full-stack TypeScript project consisting of a React frontend client and an Express.js backend server, designed for event management and social coordination.

### Project Structure
```
jam-application/
├── client/                    # React TypeScript frontend
│   ├── src/                   # Source code directory
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar/        # Navigation components
│   │   │   ├── Footer/        # Footer components
│   │   │   ├── LandingDashboard/ # Landing page components
│   │   │   ├── SSOCallback/   # Authentication callbacks
│   │   │   └── UI/            # UI utility components
│   │   ├── pages/             # Page-level components
│   │   │   ├── LandingPage/   # Landing page
│   │   │   ├── UserDashboard/ # User dashboard
│   │   │   ├── ProfilePage/   # User profile
│   │   │   ├── EventDashboard/ # Event management
│   │   │   └── ContactUs/     # Contact page
│   │   ├── services/          # API services and utilities
│   │   ├── utils/             # Utility functions
│   │   ├── reduxFiles/        # Redux store and slices
│   │   └── index.tsx          # Application entry point
│   ├── public/                # Static assets
│   ├── App.tsx                # Main App component (at root level)
│   └── package.json           # Dependencies and scripts
└── server/                    # Express TypeScript backend
    ├── controllers/           # Route controllers
    │   ├── session.ts         # Authentication controller
    │   ├── event.ts           # Event management controller
    │   └── user.ts            # User management controller
    ├── models/                # Database models
    │   ├── user.ts            # User model
    │   ├── event.ts           # Event model
    │   └── associations.ts    # Model relationships
    ├── dist/                  # Compiled JavaScript output
    ├── index.ts               # Server entry point (at root level)
    ├── app.ts                 # Express app configuration (at root level)
    ├── router.ts              # API routes definition (at root level)
    └── package.json           # Dependencies and scripts
```

## Core Development Principles

### TypeScript Excellence
All code must be written in TypeScript with strict type safety enabled. The project uses strict mode (`"strict": true`) in both client and server configurations. Never use `any` types unless absolutely necessary, and always provide proper type annotations for function parameters, return values, and complex objects. Utilize TypeScript's advanced features including generics, union types, intersection types, and mapped types to create robust, maintainable code.

### Code Quality Standards
Every piece of code must compile without errors or warnings using the project's TypeScript configuration. Before providing any code solution, mentally verify that all imports are correct, all types are properly defined, and all syntax follows TypeScript best practices. The project uses Prettier for consistent code formatting and ESLint with React app configuration for linting. Ensure all code follows these established rules.

### Modularity and Reusability
Design components and functions to be modular, reusable, and follow the single responsibility principle. Create custom hooks for shared logic, extract common utilities into separate modules, and design APIs that are intuitive and consistent across the application.

## Frontend Development Guidelines (React Client)

### TypeScript Configuration Compliance
The client uses the following TypeScript configuration that must be respected:
- Target: ES5 for broad browser compatibility
- Strict mode enabled for maximum type safety
- JSX: react-jsx for modern React JSX transform
- Module resolution: Node.js style
- Force consistent casing in file names

### Component Development Standards

#### Functional Components with Hooks
Always use functional components with React hooks instead of class components. Leverage the full power of hooks including useState, useEffect, useContext, useReducer, and custom hooks for state management and side effects.

```typescript
// Preferred approach
const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Component logic here
  
  return (
    <div className="event-card">
      {/* JSX content */}
    </div>
  );
};
```

#### Error Handling and Loading States
Always implement comprehensive error handling and loading states for any asynchronous operations. Use proper TypeScript types for error states and provide meaningful error messages to users.

```typescript
interface ComponentState {
  data: EventData | null;
  isLoading: boolean;
  error: string | null;
}

const useEventData = (eventId: string) => {
  const [state, setState] = useState<ComponentState>({
    data: null,
    isLoading: true,
    error: null
  });
  
  // Implementation with proper error handling
};
```

#### Performance Optimization
Prioritize performance optimizations using React's built-in optimization hooks:
- Use `useMemo` for expensive calculations
- Use `useCallback` for function memoization to prevent unnecessary re-renders
- Implement proper dependency arrays for hooks
- Use React.memo for component memoization when appropriate

```typescript
const ExpensiveComponent: React.FC<Props> = ({ data, onUpdate }) => {
  const expensiveValue = useMemo(() => {
    return performExpensiveCalculation(data);
  }, [data]);
  
  const handleUpdate = useCallback((newData: UpdateData) => {
    onUpdate(newData);
  }, [onUpdate]);
  
  return <div>{/* Component content */}</div>;
};
```

### State Management with Redux
The application uses Redux for global state management. Follow these patterns:
- Use Redux Toolkit (RTK) for store configuration and slice creation
- Implement proper TypeScript types for all state slices
- Use RTK Query for API state management when applicable
- Keep local component state for UI-specific state that doesn't need to be global

### Styling and UI Guidelines
The project uses Tailwind CSS for styling with a modern design system:
- Use Tailwind utility classes for consistent styling
- Implement responsive design with mobile-first approach
- Use the established color palette (purple/pink gradients)
- Include hover effects, smooth transitions, and subtle animations
- Ensure WCAG 2.1 AA accessibility compliance

### Testing Standards
Use Jest and React Testing Library for component testing:
- Write unit tests for all custom hooks
- Test component behavior, not implementation details
- Include accessibility testing in component tests
- Mock external dependencies appropriately
- Aim for high test coverage while focusing on critical paths

### File and Folder Naming Conventions
Follow these naming conventions consistently:
- Use camelCase for variables, functions, and file names
- Use PascalCase for React components and TypeScript interfaces
- Use kebab-case for CSS classes and HTML attributes
- Organize files in logical folder structures with clear separation of concerns

## Backend Development Guidelines (Express Server)

### Server Structure and Organization
The server follows a flat structure with core files at the root level:
- **index.ts** - Server entry point and startup configuration
- **app.ts** - Express application setup and middleware configuration
- **router.ts** - API route definitions and endpoint mapping
- **controllers/** - Business logic for handling requests
- **models/** - Database models and data access layer
- **dist/** - Compiled JavaScript output for production

### TypeScript Configuration
The server should use strict TypeScript configuration similar to the client, adapted for Node.js environment:
- Target appropriate Node.js version
- Enable strict mode for type safety
- Use proper module resolution for Node.js
- Include necessary type definitions for Express and other dependencies

### API Design Principles

#### RESTful Endpoint Structure
Maintain the existing API endpoint structure for backward compatibility:
- `POST /newevent/:userid` - Create new event
- `GET /events/:userid` - Get user events
- `GET /event/:eventid` - Get specific event
- Follow RESTful conventions for new endpoints

#### Request/Response Patterns
Use consistent response format across all endpoints:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}

const resBody = <T>(success: boolean, error: string | null, data: T | null, message: string): ApiResponse<T> => ({
  success,
  data,
  message,
  error
});
```

#### Authentication and Authorization
Implement robust authentication using JWT tokens:
- Validate tokens on protected routes
- Include proper error handling for authentication failures
- Use middleware for consistent authentication checks
- Support both header and cookie-based authentication

### Database Integration with Sequelize
Follow these patterns for database operations:
- Use proper TypeScript interfaces for model definitions
- Implement comprehensive validation at the model level
- Use transactions for complex operations
- Include proper error handling for database operations
- Implement proper relationships between models

### Error Handling and Logging
Implement comprehensive error handling:
- Use try-catch blocks for all async operations
- Log errors appropriately for debugging
- Return meaningful error messages to clients
- Implement proper HTTP status codes
- Handle edge cases and validation errors

### Testing with Supertest
Write comprehensive API tests using Supertest:
- Test all API endpoints with various scenarios
- Include authentication testing
- Test error conditions and edge cases
- Use proper test data setup and teardown
- Mock external dependencies when necessary

## Security Best Practices

### Input Validation and Sanitization
Always validate and sanitize user inputs:
- Use proper TypeScript types for input validation
- Implement server-side validation for all API endpoints
- Sanitize data before database operations
- Use UUID validation for ID parameters
- Implement rate limiting for API endpoints

### Authentication Security
Follow security best practices for authentication:
- Use strong JWT secrets
- Implement proper token expiration
- Hash passwords using bcrypt with appropriate salt rounds
- Implement secure session management
- Use HTTPS in production environments

### CORS and Security Headers
Configure proper CORS and security headers:
- Allow specific origins in production
- Implement proper CORS preflight handling
- Use security headers for protection against common attacks
- Implement proper content security policies

## Code Review and Quality Assurance

### Pre-commit Checks
Before submitting any code, ensure:
- All TypeScript code compiles without errors or warnings
- All tests pass (both Jest and Supertest)
- Code follows Prettier formatting rules
- ESLint rules are satisfied
- No console.log statements in production code
- Proper error handling is implemented

### Documentation Standards
Maintain comprehensive documentation:
- Use JSDoc comments for complex functions
- Document API endpoints with proper parameter descriptions
- Include usage examples for custom hooks and utilities
- Maintain up-to-date README files
- Document any breaking changes or migration steps

### Performance Considerations
Always consider performance implications:
- Optimize database queries to avoid N+1 problems
- Implement proper caching strategies
- Use pagination for large data sets
- Optimize bundle sizes for frontend code
- Monitor and profile application performance

## Deployment and Production Guidelines

### Environment Configuration
Properly configure environments:
- Use environment variables for configuration
- Implement proper secrets management
- Configure different settings for development, staging, and production
- Use proper logging levels for different environments

### Build and Deployment Process
Follow proper build and deployment practices:
- Ensure production builds are optimized
- Implement proper CI/CD pipelines
- Use proper database migration strategies
- Implement health checks for monitoring
- Configure proper backup and recovery procedures

## Accessibility and User Experience

### WCAG Compliance
Ensure all frontend components meet WCAG 2.1 AA standards:
- Provide proper alt text for images
- Ensure sufficient color contrast ratios
- Implement proper keyboard navigation
- Use semantic HTML elements
- Provide proper ARIA labels and descriptions

### Responsive Design
Implement mobile-first responsive design:
- Use Tailwind's responsive utilities
- Test on various screen sizes and devices
- Ensure touch-friendly interface elements
- Optimize performance for mobile devices
- Implement proper loading states for slow connections

## JAM Application Specific Patterns and Examples

### Component Architecture Examples

#### Event Management Components
When working with event-related components in the JAM application, follow these specific patterns that align with the existing codebase structure:

```typescript
// EventTile Component Pattern
interface EventTileProps {
  event: {
    eventId: string;
    title: string;
    date: string;
    location?: string;
    coverPic?: string;
    attendeeCount: number;
    isUpcoming: boolean;
    userIsHost: boolean;
  };
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onJoin?: (eventId: string) => void;
}

const EventTile: React.FC<EventTileProps> = ({ event, onEdit, onDelete, onJoin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAction = useCallback(async (action: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Component implementation */}
    </motion.div>
  );
};
```

#### Form Components with Validation
For form components in the JAM application, implement comprehensive validation and error handling:

```typescript
// CreateEventForm Pattern
interface CreateEventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  coverPic?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Event title must be at least 3 characters';
    }
    
    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else if (new Date(formData.date) < new Date()) {
      newErrors.date = 'Event date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Handle submission error
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form implementation */}
    </form>
  );
};
```

### API Integration Patterns

#### RTK Query Integration
The JAM application uses RTK Query for API state management. Follow these patterns for consistent API integration:

```typescript
// JamDB.ts API Service Pattern
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from './ApiResponseType';

export const jamApi = createApi({
  reducerPath: 'jamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3200',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Event', 'User', 'Todo', 'Expense', 'Attendee'],
  endpoints: (builder) => ({
    // Get current user info (for Navbar and Profile)
    getMe: builder.query<ApiResponse<UserProfile>, void>({
      query: () => '/me',
      providesTags: ['User'],
    }),
    
    // Get user events with proper caching
    getUserEvents: builder.query<ApiResponse<EventWithAttendees[]>, string>({
      query: (userId) => `/events/${userId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ eventId }) => ({ type: 'Event' as const, id: eventId })),
              { type: 'Event', id: 'LIST' },
            ]
          : [{ type: 'Event', id: 'LIST' }],
    }),
    
    // Create new event with optimistic updates
    createEvent: builder.mutation<ApiResponse<EventWithAttendees>, { userId: string; eventData: CreateEventData }>({
      query: ({ userId, eventData }) => ({
        url: `/newevent/${userId}`,
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    
    // Update event with proper cache invalidation
    updateEvent: builder.mutation<ApiResponse<EventWithAttendees>, { eventId: string; updates: Partial<CreateEventData> }>({
      query: ({ eventId, updates }) => ({
        url: `/event/${eventId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: 'Event', id: eventId },
        { type: 'Event', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUserEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = jamApi;
```

### Backend Controller Patterns

#### Express Controller Structure
Follow this pattern for all Express controllers in the JAM application:

```typescript
// controllers/event.ts Pattern
import { Request, Response } from 'express';
import { Event, User, UserEvent } from '../models/associations.js';
import { validate as uuidValidate } from 'uuid';
import { resBody } from '../utils/index.js';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}

/**
 * Create a new event
 * @route POST /newevent/:userid
 * @param req Request with userid param and event data in body
 * @param res Response with created event data
 */
const newEvent = async (req: Request, res: Response): Promise<void> => {
  // Input validation
  if (!uuidValidate(req.params.userid)) {
    res.status(400).json(resBody(false, "400", null, "Invalid user ID format"));
    return;
  }

  if (!req.body.title?.trim()) {
    res.status(400).json(resBody(false, "400", null, "Event title is required"));
    return;
  }

  try {
    // Verify user exists
    const user = await User.findByPk(req.params.userid);
    if (!user) {
      res.status(404).json(resBody(false, "404", null, "User not found"));
      return;
    }

    // Create event with transaction for data consistency
    const result = await sequelize.transaction(async (t) => {
      const event = await Event.create({
        title: req.body.title,
        description: req.body.description || null,
        date: req.body.date || new Date(),
        location: req.body.location || null,
        coverPic: req.body.coverPic || null,
        hostId: req.params.userid
      }, { transaction: t });

      await UserEvent.create({
        userId: req.params.userid,
        eventId: event.eventId,
        isHost: true,
        isGoing: true
      }, { transaction: t });

      return event;
    });

    // Fetch complete event data with relationships
    const eventWithDetails = await Event.findOne({
      where: { eventId: result.eventId },
      include: [{
        model: UserEvent,
        attributes: ['userId', 'isHost', 'isGoing'],
        include: [{
          model: User,
          attributes: ['userId', 'name', 'email', 'profilePic']
        }]
      }]
    });

    res.status(201).json(resBody(true, null, eventWithDetails, 'Event created successfully'));

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json(resBody(false, "500", null, "Failed to create event"));
  }
};

export default { newEvent };
```

## Conclusion

These guidelines ensure consistent, high-quality code across the JAM application. Always prioritize type safety, error handling, performance, and user experience in all development decisions. When in doubt, favor explicit, well-documented code over clever shortcuts, and always consider the maintainability and scalability of the solutions you implement.

Remember to test thoroughly, document comprehensively, and follow the established patterns and conventions outlined in this document. The goal is to create a robust, maintainable, and user-friendly application that serves the event management needs of our users effectively.


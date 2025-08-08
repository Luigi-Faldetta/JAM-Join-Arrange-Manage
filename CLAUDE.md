# CLAUDE.md - JAM Application Development Guide

## Project Context

JAM (Join. Arrange. Manage.) is a full-stack TypeScript event management application with the following architecture:

- **Frontend**: React 18 + TypeScript + Redux Toolkit + Tailwind CSS
- **Backend**: Express.js + TypeScript + Sequelize ORM + PostgreSQL
- **Authentication**: JWT + Clerk (SSO)
- **Real-time**: Socket.io
- **Testing**: Jest + Supertest + Cypress
- **Styling**: Tailwind CSS + DaisyUI + Flowbite

## Development Commands

### Frontend (Client)
```bash
cd client
npm start          # Start development server
npm run build      # Production build
npm test           # Run Jest tests
```

### Backend (Server)
```bash
cd server
npm run server     # Start development server with nodemon
npm run build      # Compile TypeScript
npm start          # Start production server
npm test           # Run all tests
npm run test-user  # Run user-specific tests
npm run test-event # Run event-specific tests
npm run test-todo  # Run todo-specific tests
```

## Code Quality Standards

### TypeScript Requirements
- **Strict mode enabled** - Never use `any` types
- All functions must have proper type annotations
- Interfaces for all data structures
- Proper error handling with typed errors

### Performance Guidelines
- Use `useMemo` for expensive calculations
- Use `useCallback` for function memoization
- Implement React.memo for component optimization
- Proper dependency arrays in hooks

### Testing Requirements
- **Frontend**: Jest + React Testing Library
- **Backend**: Supertest for API testing
- **E2E**: Cypress for integration tests
- Aim for high test coverage on critical paths

## Architecture Patterns

### Frontend Structure
```
client/src/
├── components/          # Reusable UI components
│   ├── AuthModal/       # Authentication modals
│   ├── Chat/           # Real-time chat components
│   ├── EventDashboard/ # Event management components
│   ├── Navbar/         # Navigation components
│   └── UI/             # Base UI components
├── pages/              # Route-level components
├── reduxFiles/         # Redux store and slices
├── services/           # API integration (RTK Query)
└── utils/              # Utility functions and hooks
```

### Backend Structure
```
server/
├── controllers/        # Request handlers
├── models/            # Sequelize models and associations
├── test/              # API tests and mocks
├── app.ts             # Express configuration
├── router.ts          # Route definitions
└── index.ts           # Server entry point
```

### Key Technologies Integration

#### Redux Toolkit + RTK Query
- Use `jamApi` service in `services/JamDB.ts` for all API calls
- Implement proper caching with `providesTags` and `invalidatesTags`
- Follow the established patterns for mutations and queries

#### Authentication Flow
- JWT tokens stored in localStorage
- Clerk for SSO integration
- Protected routes with authentication middleware
- Proper error handling for auth failures

#### Real-time Features
- Socket.io for live chat in events
- Real-time updates for event changes
- Proper connection management and error handling

## Database Schema & Models

### Core Models
- **User**: Authentication and profile data
- **Event**: Event details and metadata
- **UserEvent**: Junction table for event attendance
- **Todo**: Event-specific tasks
- **Expense**: Event expense tracking
- **EventChat**: Real-time messaging

### Model Relationships
- User has many Events (as host)
- User belongs to many Events through UserEvent
- Event has many Todos, Expenses, and EventChats
- All relationships defined in `models/associations.ts`

## API Conventions

### Response Format
All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}
```

### Key Endpoints
- `POST /newevent/:userid` - Create event
- `GET /events/:userid` - Get user events
- `GET /event/:eventid` - Get specific event
- `POST /login` - User authentication
- `GET /me` - Get current user info

### Authentication
- Bearer token in Authorization header
- UUID validation for all ID parameters
- Proper error handling with appropriate HTTP status codes

## Styling Guidelines

### Tailwind CSS Patterns
- Mobile-first responsive design
- Purple/pink gradient theme (`from-purple-600 to-pink-600`)
- Consistent spacing with Tailwind utilities
- Smooth transitions and hover effects

### Component Styling
```typescript
// Example: Event card styling
className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
```

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Sufficient color contrast ratios

## Error Handling Patterns

### Frontend Error Handling
```typescript
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);

try {
  setIsLoading(true);
  setError(null);
  // API call
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
} finally {
  setIsLoading(false);
}
```

### Backend Error Handling
```typescript
try {
  // Database operation
  res.status(200).json(resBody(true, null, data, 'Success message'));
} catch (error) {
  console.error('Operation error:', error);
  res.status(500).json(resBody(false, "500", null, "Error message"));
}
```

## Security Best Practices

### Input Validation
- UUID validation for all ID parameters
- Server-side validation for all inputs
- SQL injection prevention with Sequelize
- XSS protection with proper sanitization

### Authentication Security
- JWT secret management through environment variables
- Bcrypt for password hashing
- CORS configuration for production
- Rate limiting on sensitive endpoints

## Development Workflow

### Before Committing
1. Run TypeScript compilation: `npm run build`
2. Run all tests: `npm test`
3. Check code formatting (Prettier)
4. Verify no console.log statements in production code
5. Ensure proper error handling is implemented

### Git Commit Guidelines
- **NO Claude references**: Remove any mentions of Claude, Anthropic, or AI assistance from commit messages
- Use conventional commit format: `feat:`, `fix:`, `chore:`, etc.
- Keep messages concise and descriptive of the actual changes made
- Focus on what was changed and why, not who or what tool made the changes

### Code Review Checklist
- [ ] TypeScript compiles without errors/warnings
- [ ] All tests pass
- [ ] Proper error handling implemented
- [ ] Performance optimizations considered
- [ ] Accessibility guidelines followed
- [ ] Security best practices applied

## Performance Considerations

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization with Cloudinary
- Bundle size monitoring
- Efficient re-rendering patterns

### Backend Optimization
- Database query optimization
- Proper indexing on frequently queried fields
- Connection pooling with Sequelize
- Caching strategies for frequently accessed data

## Deployment Configuration

### Environment Variables
**Client:**
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_CLERK_PUBLISHABLE_KEY` - Clerk authentication

**Server:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3200)

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] CORS origins properly set
- [ ] Health check endpoints implemented
- [ ] Monitoring and logging configured

## Common Patterns & Examples

### Event Management Component
```typescript
const EventTile: React.FC<EventTileProps> = ({ event, onEdit, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAction = useCallback(async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4 }}
    >
      {/* Component content */}
    </motion.div>
  );
};
```

### API Service Pattern
```typescript
export const jamApi = createApi({
  reducerPath: 'jamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3200',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Event', 'User', 'Todo', 'Expense'],
  endpoints: (builder) => ({
    getUserEvents: builder.query<ApiResponse<Event[]>, string>({
      query: (userId) => `/events/${userId}`,
      providesTags: ['Event'],
    }),
  }),
});
```

## Troubleshooting Common Issues

### TypeScript Compilation Errors
- Check all imports are correctly typed
- Verify interface definitions match usage
- Ensure proper generic type parameters

### API Integration Issues
- Verify CORS configuration for cross-origin requests
- Check authentication token format and expiration
- Validate request/response type definitions

### Socket.io Connection Issues
- Ensure proper connection handling on both client and server
- Implement reconnection logic for network interruptions
- Handle authentication for socket connections

## Memory and Context Management

This CLAUDE.md file serves as the primary context document for the JAM application. Key points:

- Follow the established patterns and conventions outlined here
- Prioritize type safety and error handling in all implementations
- Use the existing component and API patterns as templates
- Maintain consistency with the established codebase architecture
- Always test thoroughly before committing changes

Remember: The goal is to maintain a robust, scalable, and maintainable event management application that serves users effectively while following modern web development best practices.
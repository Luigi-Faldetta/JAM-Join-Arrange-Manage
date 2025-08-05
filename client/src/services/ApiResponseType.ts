import { ExpenseState } from '../reduxFiles/slices/expenses';
import { UserState } from '../reduxFiles/slices/users';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  error?: string | null;
}

// Get token from localStorage with fallback
export const uid = localStorage.getItem('token') || null;

export interface ExpenseSheet {
  expenses: ExpenseState[];
  attendees: UserState[];
  total: number;
  perPerson: number;
  indExpenses: { name: string; owes: number }[];
}

// Additional types for modern components
export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  hostingEvents: number;
  attendingEvents: number;
}

export interface UserProfile extends UserState {
  profilePic?: string;
  phone?: string;
  bio?: string;
  joinedAt?: string;
  lastActive?: string;
}

export interface EventWithAttendees {
  eventId: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  coverPic?: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  UserEvents?: {
    userId: string;
    eventId: string;
    isHost: boolean;
    joinedAt: string;
    User: UserState;
  }[];
  Host?: UserState;
  attendeeCount?: number;
  isUpcoming?: boolean;
}

export interface TodoItem {
  todoId: string;
  task: string;
  isCompleted: boolean;
  eventId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  User?: UserState;
}

export interface ExpenseItem {
  expenseId: string;
  description: string;
  amount: number;
  eventId: string;
  paidBy: string;
  createdAt: string;
  updatedAt: string;
  User: UserState;
}

export interface AttendeeInfo extends UserState {
  isHost: boolean;
  joinedAt: string;
  profilePic?: string;
}

// Error types for better error handling
export interface ApiError {
  status: number;
  data: {
    success: false;
    message: string;
    error?: string;
  };
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  message: string;
}

// Filter and sort types
export interface EventFilters {
  status?: 'all' | 'upcoming' | 'past' | 'hosting' | 'attending';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'title' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface TodoFilters {
  status?: 'all' | 'pending' | 'completed';
  search?: string;
  sortBy?: 'created' | 'updated' | 'task';
  sortOrder?: 'asc' | 'desc';
}

// Form data types
export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location?: string;
  coverPic?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  eventId: string;
}

export interface CreateTodoData {
  task: string;
  eventId: string;
}

export interface UpdateTodoData {
  todoId: string;
  task?: string;
  isCompleted?: boolean;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  eventId: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profilePic?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  expiresAt: string;
}

// Utility functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.clear();
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Basic JWT token validation (check if it's expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, remove it
      removeAuthToken();
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format, remove it
    removeAuthToken();
    return false;
  }
};

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EventState } from '../reduxFiles/slices/events';
import { ExpenseState } from '../reduxFiles/slices/expenses';
import { ToDoState } from '../reduxFiles/slices/toDos';
import { UserState } from '../reduxFiles/slices/users';
import { ApiResponse } from './ApiResponseType';
import { MsgState } from '../reduxFiles/slices/msg';
import { ExpenseSheet } from './ApiResponseType';

import { io } from 'socket.io-client';
const URL =
  process.env.NODE_ENV !== 'production'
    ? process.env.REACT_APP_API_BASE_URL || 'http://localhost:3200/'
    : process.env.REACT_APP_API_BASE_URL || 'https://jam-join-arrange-manage-production.up.railway.app';

// Only initialize socket if we have a valid URL and are not in a static build
export const socket = typeof window !== 'undefined' ? io(URL, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true
}) : null;

export const fetchExpenseSheet = async (eventId: string) => {
  return await fetch(URL + `calculate/${eventId}`);
};

export const fetchLogin = async (email: string) => {
  return await fetch(URL + `passwordreset/${email}`);
};

const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Clean token in case it has extra quotes or spaces
      const cleanToken = token.replace(/["']/g, '').trim();
      headers.set('authorization', `Bearer ${cleanToken}`);
    }
    return headers;
  },
  // Force RTK Query to always make fresh requests
  credentials: 'same-origin',
});

// Custom base query that suppresses certain 500 errors
const baseQueryWithErrorSuppression: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  // Suppress console logging for expected "No items found" 500 errors
  if (result.error && 
      result.error.status === 500 && 
      result.error.data &&
      typeof result.error.data === 'object' &&
      'message' in result.error.data) {
    const message = (result.error.data as any).message;
    if (message === 'No expenses were found' || message === 'No todos were found') {
      // Don't log these expected errors to console
      return result;
    }
  }
  
  return result;
};

export const thesisDbApi = createApi({
  reducerPath: 'thesisDbApi',
  baseQuery: baseQueryWithErrorSuppression,
  tagTypes: [
    'EventState',
    'ExpenseState',
    'ToDoState',
    'UserState',
    'ExpenseSheet',
    'Me',
  ], //for tracking what will be referenced from the cache
  endpoints: (build) => ({
    // build.mutation has two type parameters, the first is response type the second is parameter type.
    // partial sets all properties to optional for parameter, pick selects which properties should be required for parameter

    // User Profile & Authentication
    getMe: build.query<ApiResponse<UserState>, void>({
      query: () => {
        const token = localStorage.getItem('token');
        const cleanToken = token ? token.replace(/["']/g, '').trim() : '';
        return {
          url: 'me',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
          },
        };
      },
      providesTags: ['Me'],
    }),

    updateMe: build.mutation<
      ApiResponse<UserState>,
      Partial<UserState> & { currentPassword?: string; newPassword?: string }
    >({
      query: (patch) => ({
        url: 'me',
        method: 'PATCH',
        body: patch,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['Me'],
    }),

    //Events

    addEvent: build.mutation<
      ApiResponse<EventState>,
      Partial<EventState> & Pick<EventState, 'title'> & { userId: string }
    >({
      query: ({ userId, ...event }) => ({
        url: `newevent/${userId}`,
        method: 'POST',
        body: event,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['EventState'],
    }),

    getEvents: build.query<ApiResponse<EventState[]>, string>({
      query: (userId) => ({ url: `events/${userId}` }),
      providesTags: ['EventState'],
    }),

    getEvent: build.query<ApiResponse<EventState>, string>({
      query: (eventId) => ({ url: `event/${eventId}` }),
      providesTags: (result, error, eventId) => [
        { type: 'EventState', id: eventId },
      ],
    }),

    updateEvent: build.mutation<
      ApiResponse<EventState>,
      Partial<EventState> & Pick<EventState, 'eventId'>
    >({
      query: ({ eventId, ...patch }) => ({
        url: `event/${eventId}`,
        method: 'PATCH',
        body: patch,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: 'EventState', id: eventId },
        'EventState',
      ],
    }),

    deleteEvent: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `event/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EventState'],
    }),

    // Users

    addUser: build.mutation<
      ApiResponse<UserState>,
      Partial<UserState> & Pick<UserState, 'name' | 'email' | 'password'>
    >({
      query: (user) => ({
        url: 'register',
        method: 'POST',
        body: user,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['UserState'],
    }),

    getUsers: build.query<ApiResponse<UserState[]>, string>({
      query: (eventId) => ({ url: `users/${eventId}` }),
      providesTags: ['UserState'],
    }),

    getUser: build.query<ApiResponse<UserState>, string>({
      query: (userId) => ({ url: `user/${userId}` }),
    }),

    updateUser: build.mutation<
      ApiResponse<UserState>,
      Partial<UserState> & Pick<UserState, 'userId'>
    >({
      query: ({ userId, ...patch }) => ({
        url: `user/${userId}`,
        method: 'PATCH',
        body: patch,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['UserState', 'Me'],
    }),

    deleteUser: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserState'],
    }),

    //Expenses

    createExpense: build.mutation<
      ApiResponse<ExpenseState>,
      { eventId: string; item: string; cost: number; purchaserId: string }
    >({
      query: ({ eventId, item, cost, purchaserId }) => ({
        url: 'expense',
        method: 'POST',
        body: { eventId, item, cost, purchaserId },
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['ExpenseState'],
    }),

    getExpenses: build.query<ApiResponse<ExpenseState[]>, string>({
      query: (eventId) => ({ url: `expenses/${eventId}` }),
      providesTags: ['ExpenseState'],
    }),

    addExpense: build.mutation<ApiResponse<ExpenseState>, ExpenseState>({
      query: (expense) => ({
        url: 'expense',
        method: 'POST',
        body: expense,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['ExpenseState'],
    }),

    calculateExpenses: build.query<ApiResponse<ExpenseSheet>, string>({
      query: (eventId) => `calculate/${eventId}`,
      providesTags: ['ExpenseSheet'],
    }),

    deleteExpense: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `expense/${id}`,
        method: 'DELETE',
      }),
      // Don't automatically invalidate - let components handle state updates  
      invalidatesTags: [],
    }),

    //Todos

    createTodo: build.mutation<
      ApiResponse<ToDoState>,
      { eventId: string; title: string; creatorId: string }
    >({
      query: ({ eventId, title, creatorId }) => ({
        url: 'todo',
        method: 'POST',
        body: { eventId, title, isDone: false, creatorId },
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: [],
    }),

    addToDo: build.mutation<
      ApiResponse<ToDoState>,
      Partial<ToDoState> & Pick<ToDoState, 'title'>
    >({
      query: (toDo) => ({
        url: 'todo',
        method: 'POST',
        body: toDo,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: [],
    }),

    getTodos: build.query<ApiResponse<ToDoState[]>, string>({
      query: (eventId) => ({ url: `todos/${eventId}` }),
      providesTags: ['ToDoState'],
    }),

    getToDos: build.query<ApiResponse<ToDoState[]>, string>({
      query: (eventId) => ({ url: `todos/${eventId}` }),
      providesTags: ['ToDoState'],
    }),

    updateTodo: build.mutation<
      ApiResponse<ToDoState>,
      { todoId: string; task?: string; isCompleted?: boolean }
    >({
      query: ({ todoId, task, isCompleted, ...patch }) => {
        // Transform field names to match backend expectations
        const transformedBody: any = { ...patch };
        if (task !== undefined) {
          transformedBody.title = task;
        }
        if (isCompleted !== undefined) {
          transformedBody.isDone = isCompleted;
        }
        
        return {
          url: `todo/${todoId}`,
          method: 'PATCH',
          body: transformedBody,
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        };
      },
      invalidatesTags: [],
    }),

    updateToDo: build.mutation<
      ApiResponse<ToDoState>,
      Partial<ToDoState> & Pick<ToDoState, 'id'>
    >({
      query: ({ id, ...patch }) => ({
        url: `todo/${id}`,
        method: 'PATCH',
        body: patch,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: [],
    }),

    deleteTodo: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `todo/${id}`,
        method: 'DELETE',
      }),
      // Don't automatically invalidate - let components handle state updates
      invalidatesTags: [],
    }),

    deleteToDo: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `todo/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ToDoState'],
    }),

    //Messages:
    addMsg: build.mutation<
      ApiResponse<MsgState>,
      Partial<MsgState> & Pick<MsgState, 'userId' | 'eventId' | 'message'>
    >({
      query: (msg) => ({
        url: 'chat',
        method: 'POST',
        body: msg,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
    }),

    getMsgs: build.query<ApiResponse<MsgState[]>, string>({
      query: (eventId) => {
        if (!eventId) {
          console.log(eventId);
          throw new Error();
        }
        return { url: `chat/${eventId}` };
      },
    }),

    //Activity participation

    joinEvent: build.mutation<
      ApiResponse<null>,
      { userId: string; eventId: string }
    >({
      query: (ids) => ({
        url: 'useractivity',
        method: 'POST',
        body: ids,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['EventState', 'UserState'],
    }),

    leaveEvent: build.mutation<
      ApiResponse<null>,
      { userId: string; eventId: string }
    >({
      query: (ids) => ({
        url: `useractivity/`,
        method: 'DELETE',
        body: ids,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['EventState', 'UserState'],
    }),

    joinActivity: build.mutation<
      ApiResponse<null>,
      { userId: string; eventId: string }
    >({
      query: (ids) => ({
        url: 'useractivity',
        method: 'POST',
        body: ids,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['EventState', 'UserState'],
    }),

    leaveActivity: build.mutation<
      ApiResponse<null>,
      { userId: string; eventId: string }
    >({
      query: (ids) => ({
        url: `useractivity/`,
        method: 'DELETE',
        body: ids,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['EventState', 'UserState'],
    }),

    //Social Login

    socialLogin: build.mutation<
      ApiResponse<string>,
      { code: string; state?: string }
    >({
      query: (body) => ({
        url: 'auth/google-callback',
        method: 'POST',
        body,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
    }),

    //Session

    logIn: build.mutation<
      ApiResponse<null | string>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: 'userlogin',
        method: 'POST',
        body: credentials,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['Me', 'EventState', 'UserState'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Clear all API cache to ensure fresh data with new token
          dispatch(thesisDbApi.util.resetApiState());
        } catch {}
      },
    }),

    resetPassword: build.mutation<ApiResponse<null>, { email: string }>({
      query: ({ email }) => ({
        url: `passwordreset/${email}`,
        method: 'GET',
      }),
    }),

    logOut: build.query<ApiResponse<null>, null>({
      query: () => ({ url: `userlogout` }),
    }),
  }),
});

export const {
  // User Profile
  useGetMeQuery,
  useUpdateMeMutation,

  //add/create
  useAddEventMutation,
  useAddExpenseMutation,
  useCreateExpenseMutation,
  useAddToDoMutation,
  useCreateTodoMutation,
  useAddUserMutation,
  useJoinActivityMutation,
  useJoinEventMutation,

  //get
  useCalculateExpensesQuery,
  useGetEventQuery,
  useGetEventsQuery,
  useGetExpensesQuery,
  useGetToDosQuery,
  useGetTodosQuery,
  useGetUserQuery,
  useGetUsersQuery,

  //update
  useUpdateUserMutation,
  useUpdateEventMutation,
  useUpdateToDoMutation,
  useUpdateTodoMutation,

  //delete
  useDeleteEventMutation,
  useDeleteExpenseMutation,
  useDeleteTodoMutation,
  useLeaveActivityMutation,
  useLeaveEventMutation,
  useDeleteToDoMutation,
  useDeleteUserMutation,

  //login & logout
  useLogInMutation,
  useResetPasswordMutation,
  useSocialLoginMutation,
  useLogOutQuery,

  //msg
  useAddMsgMutation,
  useGetMsgsQuery,
} = thesisDbApi;

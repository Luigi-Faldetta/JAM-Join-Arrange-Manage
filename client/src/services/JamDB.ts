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
    ? 'http://localhost:3200/'
    : process.env.REACT_APP_API_URL || 'https://codeworks-thesis-4063bceaa74a.herokuapp.com/';

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

export const thesisDbApi = createApi({
  reducerPath: 'thesisDbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
      query: () => ({ url: 'me' }),
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
      Partial<EventState> & Pick<EventState, 'title'>
    >({
      query: (event) => ({
        url: `newevent`,
        method: 'POST',
        body: event,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['EventState'],
    }),

    getEvents: build.query<ApiResponse<EventState[]>, void>({
      query: () => ({ url: `events` }),
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
        url: 'register/',
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
      { eventId: string; description: string; amount: number }
    >({
      query: ({ eventId, description, amount }) => ({
        url: 'expense',
        method: 'POST',
        body: { eventId, description, amount },
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
      invalidatesTags: ['ExpenseState'],
    }),

    //Todos

    createTodo: build.mutation<
      ApiResponse<ToDoState>,
      { eventId: string; task: string }
    >({
      query: ({ eventId, task }) => ({
        url: 'todo/',
        method: 'POST',
        body: { eventId, task },
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['ToDoState'],
    }),

    addToDo: build.mutation<
      ApiResponse<ToDoState>,
      Partial<ToDoState> & Pick<ToDoState, 'title'>
    >({
      query: (toDo) => ({
        url: 'todo/',
        method: 'POST',
        body: toDo,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['ToDoState'],
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
      query: ({ todoId, ...patch }) => ({
        url: `todo/${todoId}`,
        method: 'PATCH',
        body: patch,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['ToDoState'],
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
      invalidatesTags: ['ToDoState'],
    }),

    deleteTodo: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `todo/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ToDoState'],
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
        url: 'chat/',
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
        url: 'useractivity/',
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
        url: 'useractivity/',
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
        url: 'userLogin/',
        method: 'POST',
        body: credentials,
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      }),
      invalidatesTags: ['Me'],
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
  useSocialLoginMutation,
  useLogOutQuery,

  //msg
  useAddMsgMutation,
  useGetMsgsQuery,
} = thesisDbApi;

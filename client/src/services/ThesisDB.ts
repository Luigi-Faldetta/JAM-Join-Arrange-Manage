import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EventState } from "../reduxFiles/slices/events";
import { ExpenseState } from "../reduxFiles/slices/expenses";
import { ToDoState } from "../reduxFiles/slices/toDos";
import { UserState } from "../reduxFiles/slices/users";
import { ApiResponse } from "./ApiResponseType";
import { MsgState } from "../reduxFiles/slices/msg";


import { io } from "socket.io-client";
const URL = process.env.NODE_ENV!=="production" ? "http://localhost:3200/" :"https://codeworks-thesis-4063bceaa74a.herokuapp.com/";

export const socket = io(URL);
// const {data, error, isLoading} = useGetUserQuery("f099247b-189d-4025-81eb-1a53c1e9c332")
// const [addNewUser] = useAddUserMutation()

// const onSubmit = async () => {
//   try {
//     const res = await addNewUser({name: "Xavi3", email: "xavi3@email.com", password: "xavi3"});
//     // console.log((res as { data : ApiResponse<UserState>}).data.data.name)
//   } catch (error) {
//     // console.error(error)
//   }
// }

// console.log("data: ", data);

// someReturn
// {error ? console.log({error}) : isLoading ? <p>loading...</p> : data ? <h3>{data.data.name}</h3> : <p>couldn't fetch</p>}

//for more complete code and better error handling, refer back to the
//and implement the transformErrorResponse, providesTags, OnQueryStarted,
//transformResponse and OnCacheEntryStarted,
//https://redux-toolkit.js.org/rtk-query/usage/queries

export const thesisDbApi = createApi({
  reducerPath: "thesisDbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  tagTypes: ["EventState", "ExpenseState", "ToDoState", "UserState"], //for tracking what will be referenced from the cache
  endpoints: (build) => ({
    // build.mutation has two type parameters, the first is response type the second is parameter type.
    // partial sets all properties to optional for parameter, pick selects which properties should be required for parameter

    //Events

    addEvent: build.mutation<
      ApiResponse<EventState>,
      { token: string; event: Partial<EventState> & Pick<EventState, "title"> }
    >({
      query: (info) => ({
        url: `newevent/${info.token}`,
        method: "POST",
        body: info.event,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    getEvents: build.query<ApiResponse<EventState[]>, string>({
      query: (userId) => ({ url: `events/${userId}` }),
      providesTags: ["EventState"],
    }),

    getEvent: build.query<ApiResponse<EventState>, string>({
      query: (eventId) => ({ url: `event/${eventId}` }),
    }),

    updateEvent: build.mutation<
      ApiResponse<EventState>,
      Partial<EventState> & Pick<EventState, "eventId">
    >({
      query: ({ eventId, ...patch }) => ({
        url: `event/${eventId}`,
        method: "PATCH",
        body: patch,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    deleteEvent: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EventState"],
    }),

    // Users

    addUser: build.mutation<
      ApiResponse<UserState>,
      Partial<UserState> & Pick<UserState, "name" | "email" | "password">
    >({
      query: (user) => ({
        url: "register/",
        method: "POST",
        body: user,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
      invalidatesTags: ["UserState"],
    }),

    getUsers: build.query<ApiResponse<UserState[]>, string>({
      query: (eventId) => ({ url: `users/${eventId}` }),
    }),

    getUser: build.query<ApiResponse<UserState>, string>({
      query: (userId) => ({ url: `user/${userId}` }),
    }),

    updateUser: build.mutation<
      ApiResponse<UserState>,
      Partial<UserState> & Pick<UserState, "userId">
    >({
      query: ({ userId, ...patch }) => ({
        url: `user/${userId}`,
        method: "PATCH",
        body: patch,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    deleteUser: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
    }),

    //Expenses

    addExpense: build.mutation<
      ApiResponse<ExpenseState>,
      Partial<ExpenseState> & Pick<ExpenseState, "item">
    >({
      query: (expense) => ({
        url: "expense/",
        method: "POST",
        body: expense,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    calculateExpenses: build.mutation<
      ApiResponse<ExpenseState>,
      Partial<ExpenseState> & Pick<ExpenseState, "item">
    >({
      query: (expense) => ({
        url: "expense/",
        method: "POST",
        body: expense,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    getExpenses: build.query<ApiResponse<ExpenseState[]>, string>({
      query: (eventId) => ({ url: `expenses/${eventId}` }),
    }),

    deleteExpense: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `expense/${id}`,
        method: "DELETE",
      }),
    }),

    //Todos

    addToDo: build.mutation<
      ApiResponse<ToDoState>,
      Partial<ToDoState> & Pick<ToDoState, "title">
    >({
      query: (toDo) => ({
        url: "todo/",
        method: "POST",
        body: toDo,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    getToDos: build.query<ApiResponse<ToDoState[]>, string>({
      query: (eventId) => ({ url: `todos/${eventId}` }),
    }),

    updateToDo: build.mutation<
      ApiResponse<ToDoState>,
      Partial<ToDoState> & Pick<ToDoState, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `todo/${id}`,
        method: "PATCH",
        body: patch,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    deleteToDo: build.mutation<ApiResponse<number>, string>({
      query: (id) => ({
        url: `todo/${id}`,
        method: "DELETE",
      }),
    }),
    //Messages:
    addMsg: build.mutation<
      ApiResponse<MsgState>,
      Partial<MsgState> & Pick<MsgState, "userId" | "eventId" | "message">
    >({
      query: (msg) => ({
        url: "chat/",
        method: "POST",
        body: msg,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),
    getMsgs: build.query<ApiResponse<MsgState[]>, string>({
      query: (eventId) => {
        if (!eventId) {
          console.log(eventId)
          throw new Error();
        }
        return { url: `chat/${eventId}` };
      },
    }),

    //Activity participation

    joinActivity: build.mutation<
      ApiResponse<null>,
      { userId: string; eventId: string }
    >({
      query: (ids) => ({
        url: "useractivity/",
        method: "POST",
        body: ids,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    leaveActivity: build.mutation<
      ApiResponse<null>,
      { userId: string; eventId: string }
    >({
      query: (ids) => ({
        url: `useractivity/`,
        method: "DELETE",
        body: ids,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    //Session

    logIn: build.mutation<
      ApiResponse<null | string>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "userLogin/",
        method: "POST",
        body: credentials,
        headers: { "Content-type": "application/json; charset=UTF-8" },
      }),
    }),

    logOut: build.query<ApiResponse<null>, null>({
      query: () => ({ url: `userlogout` }),
    }),
  }),
});

export const {
  //add
  useAddEventMutation,
  useAddExpenseMutation,
  useAddToDoMutation,
  useAddUserMutation,
  useJoinActivityMutation,
  //get
  useGetEventQuery,
  useGetEventsQuery,
  useGetExpensesQuery,
  useGetToDosQuery,
  useGetUserQuery,
  useGetUsersQuery,
  //update
  useUpdateUserMutation,
  useUpdateEventMutation,
  useUpdateToDoMutation,
  //delete
  useDeleteEventMutation,
  useDeleteExpenseMutation,
  useLeaveActivityMutation,
  useDeleteToDoMutation,
  useDeleteUserMutation,
  //login & logout
  useLogInMutation,
  useLogOutQuery,
  //msg
  useAddMsgMutation,
  useGetMsgsQuery,
} = thesisDbApi;

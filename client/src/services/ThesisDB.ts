import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { EventState } from '../reduxFiles/slices/events'
import { ExpenseState } from '../reduxFiles/slices/expenses'
import { ToDoState } from '../reduxFiles/slices/toDos'
import { UserState } from '../reduxFiles/slices/users'

export const thesisDbApi = createApi({
    reducerPath: 'thesisDbApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://codeworks-thesis-4063bceaa74a.herokuapp.com/' }),
    tagTypes: ['EventState', 'ExpenseState', 'ToDoState', 'UserState'],
    endpoints: (build) => ({
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addEvent: build.mutation({
            query:(event:EventState) => ({
                url: 'events/',
                method: 'POST',
                body: event
            })
        }),
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addUser: build.mutation({
            query:(user:UserState) => ({
                url: 'events/',
                method: 'POST',
                body: user
            })
        }),
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addExpense: build.mutation({
            query:(expense:ExpenseState) => ({
                url: 'events/',
                method: 'POST',
                body: expense
            })
        }),
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addToDo: build.mutation({
            query:(toDo:ToDoState) => ({
                url: 'events/',
                method: 'POST',
                body: toDo
            })
        }),
        //the second type argument for query I THINK refers to the type 
        //of the parameter we will use to fetch this list, so userID
        getEvents: build.query<EventState[], string>({
            query: (userId) => ({url:`events/${userId}`}),
            transformResponse: (response: { data: EventState[] }, meta, arg) => response.data,
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //and OnCacheEntryStarted, we may use these for post and patch as well
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getEvent: build.query<EventState, string>({
            query: (eventId) => ({url:`events/${eventId}`}),
            transformResponse: (response: { data: EventState }, meta, arg) => response.data,
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //and OnCacheEntryStarted
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getUsers: build.query<UserState[], string>({
            query: (eventId) => ({url:`users/${eventId}`}),
            transformResponse: (response: { data: UserState[] }, meta, arg) => response.data,
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //and OnCacheEntryStarted
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getUser: build.query<UserState, string>({
            query: (userId) => ({url:`events/${userId}`}),
            transformResponse: (response: { data: UserState }, meta, arg) => response.data,
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //and OnCacheEntryStarted, 
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getExpenses: build.query<ExpenseState[], string>({
            query: (eventId) => ({url:`expenses/${eventId}`}),
            transformResponse: (response: { data: ExpenseState[] }, meta, arg) => response.data,
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //and OnCacheEntryStarted
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getTodos: build.query<ToDoState[], string>({
            query: (eventId) => ({url:`todos/${eventId}`}),
            transformResponse: (response: { data: ToDoState[] }, meta, arg) => response.data,
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //and OnCacheEntryStarted
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
    }),
  })
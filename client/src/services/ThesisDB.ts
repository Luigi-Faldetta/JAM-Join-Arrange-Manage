import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { EventState } from '../reduxFiles/slices/events'
import { ExpenseState } from '../reduxFiles/slices/expenses'
import { ToDoState } from '../reduxFiles/slices/toDos'
import { UserState } from '../reduxFiles/slices/users'
import { ApiResponse } from './ApiResponseType'

// const {data, error} = useGetUserQuery("f099247b-189d-4025-81eb-1a53c1e9c332")
// const [addNewUser] = useAddUserMutation()

// const postUser = async () => {
//   try {
//     const res = await addNewUser({name: "Xavi3", email: "xavi3@email.com", password: "xavi3"});
//     console.log((res as { data : ApiResponse<UserState>}).data.data.name)
//   } catch (error) {
//     console.error(error)
//   }
// }

// console.log("data: ", data);

// someReturn 
// {error ? console.log({error}) : isLoading ? <p>loading...</p> : data ? <h3>{data.data.name}</h3> : <p>couldn't fetch</p>}  

export const thesisDbApi = createApi({
    reducerPath: 'thesisDbApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://codeworks-thesis-4063bceaa74a.herokuapp.com/' }),
    tagTypes: ['EventState', 'ExpenseState', 'ToDoState', 'UserState'], //for tracking what will be referenced from the cache
    endpoints: (build) => ({
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addEvent: build.mutation({
            query:(event:EventState) => ({
                url: 'newevent/',
                method: 'POST',
                body: event
            })
        }),
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addUser: build.mutation<ApiResponse<UserState>, Partial<UserState> & Pick<UserState, 'name' | 'email' | 'password'>>({
            query:(user) => ({
                url: 'register/',
                method: 'POST',
                body: user,
                headers: {'Content-type': 'application/json; charset=UTF-8' },
            }),
            invalidatesTags: ['UserState'],
        }),
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addExpense: build.mutation({
            query:(expense) => ({
                url: 'expense/',
                method: 'POST',
                body: expense,
            })
        }),
        // build.mutation has two type parameters, the first is any, 
        // do we need to fix/address this?
        // also in mutation type, we may need to include pick<T> since these
        // wont have id's by default
        addToDo: build.mutation({
            query:(toDo:ToDoState) => ({
                url: 'todo/',
                method: 'POST',
                body: toDo
            })
        }),
        //the second type argument for query I THINK refers to the type 
        //of the parameter we will use to fetch this list, so userID
        getEvents: build.query({
            query: (userId) => ({url:`events/${userId}`}),
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //transformResponse and OnCacheEntryStarted, 
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getEvent: build.query({
            query: (eventId) => ({url:`event/${eventId}`}),
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //transformResponse and OnCacheEntryStarted, 
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getUsers: build.query({
            query: (eventId) => ({url:`users/${eventId}`}),
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //transformResponse and OnCacheEntryStarted, 
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getUser: build.query<ApiResponse<UserState>, string>({
            query: (userId) => ({url:`user/${userId}`}),
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //transformResponse and OnCacheEntryStarted, 
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getExpenses: build.query({
            query: (eventId) => ({url:`expenses/${eventId}`}),
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //transformResponse and OnCacheEntryStarted, 
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
        getTodos: build.query({
            query: (eventId) => ({url:`todos/${eventId}`}),
            //for more complete code and better error handling, refer back to the 
            //and implement the transformErrorResponse, providesTags, OnQueryStarted,
            //transformResponse and OnCacheEntryStarted, 
            //https://redux-toolkit.js.org/rtk-query/usage/queries
        }),
    }),
  })

  export const {
    useAddEventMutation,
    useAddExpenseMutation,
    useAddToDoMutation,
    useAddUserMutation,
    useGetEventQuery,
    useGetEventsQuery,
    useGetExpensesQuery,
    useGetTodosQuery,
    useGetUserQuery,
    useGetUsersQuery,
} = thesisDbApi;
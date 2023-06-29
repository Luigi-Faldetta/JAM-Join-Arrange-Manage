import { configureStore } from "@reduxjs/toolkit";
import eventReducers from "./slices/events";
import expenseReducers from "./slices/expenses";
import toDoReducers from "./slices/toDos";
import userReducers from "./slices/users";
// import { setupListeners } from '@reduxjs/toolkit/query'
import { thesisDbApi } from "../services/ThesisDB";
import { useDispatch } from "react-redux";
import { logoutReducer } from "./slices/logout";


const store = configureStore({
  reducer: {
    logoutReducer,
    eventListReducer: eventReducers.eventListReducer,
    eventReducer: eventReducers.eventReducer,
    userListReducer: userReducers.userListReducer,
    userReducer: userReducers.userReducer,
    toDoListReducer: toDoReducers.toDoListReducer,
    toDoReduer: toDoReducers.toDoReducer,
    expenseListReducer: expenseReducers.expenseListReducer,
    expenseReducer: expenseReducers.expenseReducer,
    [thesisDbApi.reducerPath]: thesisDbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thesisDbApi.middleware),
  devTools: true,
});

// not sure if we need the line below, it is generally optional, but it IS required
// if we use refetchOnFous or refetchOnReconnect
// setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch

export default store;

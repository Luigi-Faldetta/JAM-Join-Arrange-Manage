import { configureStore } from "@reduxjs/toolkit";
import eventReducers from "./slices/events";
import expenseReducers from "./slices/expenses";
import toDoReducers from "./slices/toDos";
import userReducers from "./slices/users";
import msgReducers from './slices/msg'
import { thesisDbApi } from "../services/JamDB";
import { useDispatch } from "react-redux";
import { logoutReducer } from "./slices/logout";
import { chatReducer } from "./slices/chat";


const store = configureStore({
  reducer: {
    chatReducer,
    logoutReducer,
    msgListReducer: msgReducers.msgListReducer, 
    msgReducer: msgReducers.msgReducer,
    eventListReducer: eventReducers.eventListReducer,
    eventReducer: eventReducers.eventReducer,
    userReducer: userReducers.userReducer,
    userList: userReducers.userListReducer,
    toDoListReducer: toDoReducers.toDoListReducer,
    expenseReducer: expenseReducers.expenseReducer,
    [thesisDbApi.reducerPath]: thesisDbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thesisDbApi.middleware),
  devTools: true,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch

export default store;

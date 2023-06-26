<<<<<<< HEAD
import { configureStore } from '@reduxjs/toolkit';
import eventReducers from './slices/events'
import expenseReducers from './slices/expenses'
import toDoReducers from './slices/toDos'
import userReducers from './slices/users'
=======
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
>>>>>>> create-event-form

const store = configureStore({
  reducer: {
    eventListReducer: eventReducers.eventListReducer,
    eventReducer:eventReducers.eventReducer,
    userListReducer: userReducers.userListReducer,
    userReducer: userReducers.userReducer,
    toDoListReducer: toDoReducers.toDoListReducer,
    toDoReduer: toDoReducers.toDoReducer,
    expenseListReducer:expenseReducers.expenseListReducer,
    expenseReducer:expenseReducers.expenseReducer
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

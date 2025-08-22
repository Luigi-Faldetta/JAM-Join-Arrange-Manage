import { configureStore } from '@reduxjs/toolkit';
import eventReducers, { EventState } from './slices/events';
import expenseReducer from './slices/expenses';
import toDoListReducer from './slices/toDos';
import userReducers from './slices/users';
import msgReducers from './slices/msg';
import { thesisDbApi } from '../services/JamDB';
import { useDispatch } from 'react-redux';
import { logoutReducer } from './slices/logout';
import { chatReducer } from './slices/chat';
import { authModalReducer } from './slices/authModal';
import preferencesReducer from './slices/preferences';

const store = configureStore({
  reducer: {
    chatReducer,
    logoutReducer,
    authModalReducer,
    preferencesReducer,
    msgListReducer: msgReducers.msgListReducer,
    msgReducer: msgReducers.msgReducer,
    eventListReducer: eventReducers.eventListReducer,
    eventReducer: eventReducers.eventReducer,
    userReducer: userReducers.userReducer,
    userList: userReducers.userListReducer,
    toDoListReducer, // <-- fixed
    expenseReducer, // <-- fixed
    [thesisDbApi.reducerPath]: thesisDbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thesisDbApi.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;

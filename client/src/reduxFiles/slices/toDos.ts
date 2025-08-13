import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ToDoState {
  id?: string;
  title: string;
  isDone: boolean;
  creatorId: string;
  eventId: string;
}

export const toDoListSlice = createSlice({
  name: 'toDoList',
  initialState: [] as ToDoState[],
  reducers: {
    setToDoList: (state, action: PayloadAction<ToDoState[]>) => action.payload,
    deleteToDoFromList: (state, action: PayloadAction<string>) =>
      state.filter((toDo) => String(toDo.id) !== action.payload),
    addToToDoList: (state, action: PayloadAction<ToDoState>) => {
      state.push(action.payload);
    },
    updateToDoList: (state, action: PayloadAction<string>) => {
      return state.map((todo) => {
        if (String(todo.id) === action.payload) {
          return { ...todo, isDone: !todo.isDone };
        }
        return todo;
      });
    },
    editToDoInList: (state, action: PayloadAction<{ id: string; title: string }>) => {
      return state.map((todo) => {
        if (String(todo.id) === action.payload.id) {
          return { ...todo, title: action.payload.title };
        }
        return todo;
      });
    },
  },
});

export const {
  setToDoList,
  updateToDoList,
  deleteToDoFromList,
  addToToDoList,
  editToDoInList,
} = toDoListSlice.actions;

export default toDoListSlice.reducer;

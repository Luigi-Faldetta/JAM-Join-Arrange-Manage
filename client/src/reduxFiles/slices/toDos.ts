import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ToDoState {
    id?: string;
    title: string;
    isDone: boolean;
    creatorId: string;
    eventId: string;
}

export const toDoListSlice = createSlice({
    name: "toDoList",
    initialState: [] as ToDoState[],
    reducers: {
        setToDoList: (state, action: PayloadAction<ToDoState[]>) => { return action.payload },
        deleteToDoFromList: (state, action:PayloadAction<string>) => { return state.filter(toDo => toDo.id !== action.payload) },
        addToToDoList: (state, action: PayloadAction<ToDoState>) => { state.push(action.payload) } ,
        updateToDoList: (state, action: PayloadAction<string>) => { state.map(todo => {
            if(todo.id === action.payload) {
                todo.isDone = !todo.isDone;
            }
            return todo
        }) } ,
    }
})

export const { setToDoList, updateToDoList, deleteToDoFromList, addToToDoList } = toDoListSlice.actions

const toDoListReducer = toDoListSlice.reducer

export default { toDoListReducer}
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ToDoState {
    //update interface once types are declared
    id?: string;
    value: string;
}

const initialToDoState:ToDoState = {
    value: ""
}

export const toDoSlice = createSlice({
    name: "toDo",
    initialState: initialToDoState,
    reducers: {
        //state type will be ToDo when the type is created.
        createToDo: (state) => { state.value = ""},
        deleteToDo: (state) => { state.value = ""},
        updateToDo: (state) => { state.value = ""},
    }
})

export const toDoListSlice = createSlice({
    name: "toDoList",
    initialState: [] as ToDoState[],
    reducers: {
        //state type will be ToDo when the type is created.
        createToDoList: (state) => { state = []},
        deleteToDoList: (state) => { state = []},
        updateToDoList: (state) => { state = []},
    }
})

export const { createToDo, updateToDo, deleteToDo } = toDoSlice.actions
export const { createToDoList, updateToDoList, deleteToDoList } = toDoListSlice.actions

const toDoReducer = toDoSlice.reducer
const toDoListReducer = toDoListSlice.reducer

export default {toDoListReducer, toDoReducer}
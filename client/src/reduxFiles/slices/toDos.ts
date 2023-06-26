import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ToDoState {
    //update interface once types are declared
    value: string
}

export interface ToDoListState {
    //update interface once types are declared
    value:ToDoState[]
}

const initialToDoState:ToDoState = {
    value: ""
}

const initialToDoListState: ToDoListState = {
    value: [],
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
    initialState: initialToDoListState,
    reducers: {
        //state type will be ToDo when the type is created.
        createToDoList: (state) => { state.value = []},
        deleteToDoList: (state) => { state.value = []},
        updateToDoList: (state) => { state.value = []},
    }
})

export const { createToDo, updateToDo, deleteToDo } = toDoSlice.actions
export const { createToDoList, updateToDoList, deleteToDoList } = toDoListSlice.actions

const toDoReducer = toDoSlice.reducer
const toDoListReducer = toDoListSlice.reducer

export default {toDoListReducer, toDoReducer}
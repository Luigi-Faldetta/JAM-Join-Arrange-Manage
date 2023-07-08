import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ToDoState {
    //update interface once types are declared
    id?: string;
    title: string;
    isDone: boolean;
    creatorId: string;
    eventId: string;
}

// const initialToDoState: ToDoState = {
//     title: "",
//     isDone: false,
//     creatorId: "",
//     eventId: "",
// }

// export const toDoSlice = createSlice({
//     name: "toDo",
//     initialState: initialToDoState,
//     reducers: {
//         //state type will be ToDo when the type is created.
//         addToDo: (state, action:PayloadAction<ToDoState>) => { state = action.payload },
//         deleteToDo: (state) => { state = initialToDoState},
//         // updateToDo: (state) => { state.title = "" },
//     }
// })

export const toDoListSlice = createSlice({
    name: "toDoList",
    initialState: [] as ToDoState[],
    reducers: {
        //state type will be ToDo when the type is created.
        setToDoList: (state, action: PayloadAction<ToDoState[]>) => { state = action.payload },
        deleteToDoFromList: (state, action:PayloadAction<string>) => { state.filter(toDo => toDo.id !== action.payload) },
        addToToDoList: (state, action: PayloadAction<ToDoState>) => { state.push(action.payload) } ,
        updateToDoList: (state, action: PayloadAction<string>) => { return state.map(todo => {
            if(todo.id === action.payload) todo.isDone = !todo.isDone;
            return todo
        }) } ,
    }
})

// export const { addToDo, /*updateToDo,*/ deleteToDo } = toDoSlice.actions
export const { setToDoList, updateToDoList, deleteToDoFromList, addToToDoList } = toDoListSlice.actions

// const toDoReducer = toDoSlice.reducer
const toDoListReducer = toDoListSlice.reducer

export default { toDoListReducer, /*toDoReducer*/ }
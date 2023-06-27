import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    //update interface once types are declared
    value: string
}

const initialUserState:UserState = {
    value: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialUserState,
    reducers: {
        //state type will be User when the type is created.
        createUser: (state) => { state.value = ""},
        deleteUser: (state) => { state.value = ""},
        updateUser: (state) => { state.value = ""},
    }
})

export const userListSlice = createSlice({
    name: "userList",
    initialState: [] as UserState[],
    reducers: {
        //state type will be User when the type is created.
        createUserList: (state) => { state = []},
        deleteUserList: (state) => { state = []},
        updateUserList: (state) => { state = []},
    }
})

export const { createUser, updateUser, deleteUser } = userSlice.actions
export const { createUserList, updateUserList, deleteUserList } = userListSlice.actions

const userReducer = userSlice.reducer
const userListReducer = userListSlice.reducer

export default {userListReducer, userReducer}
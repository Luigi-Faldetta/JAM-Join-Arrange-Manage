import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    //update interface once types are declared
    value: string
}

export interface UserListState {
    //update interface once types are declared
    value:UserState[]
}

const initialUserState:UserState = {
    value: ""
}

const initialUserListState: UserListState = {
    value: [],
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
    initialState: initialUserListState,
    reducers: {
        //state type will be User when the type is created.
        createUserList: (state) => { state.value = []},
        deleteUserList: (state) => { state.value = []},
        updateUserList: (state) => { state.value = []},
    }
})

export const { createUser, updateUser, deleteUser } = userSlice.actions
export const { createUserList, updateUserList, deleteUserList } = userListSlice.actions

const userReducer = userSlice.reducer
const userListReducer = userListSlice.reducer

export default {userListReducer, userReducer}
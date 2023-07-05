import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  //update interface once types are declared
  userId?: string;
  name?: string;
  email: string;
  password: string;
  phone?: string;
  profilePic?: string;
}

const initialUserState: UserState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  profilePic: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    //state type will be User when the type is created.
    createUser: (
      state = initialUserState,
      action: PayloadAction<UserState>
    ) => {
      state = action.payload;
    },
    deleteUser: (state) => {
      state = state;
    },
    updateUserState: (state: UserState, action) => {
      state = action.payload;
    },
  },
});

export const userListSlice = createSlice({
  name: "userList",
  initialState: [] as UserState[],
  reducers: {
    //state type will be User when the type is created.
    createUserList: (state, action:PayloadAction<UserState[]>) => {
      return  action.payload;
    },
    deleteUserFromList: (state, action:PayloadAction<string>) => {
      return state.filter(user => user.userId !==action.payload);
    },
    updateUserList: (state, action:PayloadAction<UserState>) => {
      state.push(action.payload);
    },
  },
});

export const { createUser, updateUserState, deleteUser } = userSlice.actions;
export const { createUserList, updateUserList, deleteUserFromList } =
  userListSlice.actions;

const userReducer = userSlice.reducer;
const userListReducer = userListSlice.reducer;

export default { userListReducer, userReducer };

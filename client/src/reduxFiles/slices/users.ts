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
    updateUserState: (state: UserState, action) => {
      state = action.payload;
    },
  },
});

export const { createUser, updateUserState} = userSlice.actions;

const userReducer = userSlice.reducer;

export default { userReducer };

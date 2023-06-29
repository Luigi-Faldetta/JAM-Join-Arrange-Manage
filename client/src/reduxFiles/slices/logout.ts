import { createSlice } from "@reduxjs/toolkit";


const initialState: Boolean = false;

const logoutSlice = createSlice({
    name: 'logout',
    initialState,
    reducers: {
        toggleLogout: (state) => !state,
        resetLogout: () => false,
        openLogout: () => true,
        closeLogout: () => false
    }
})

export const { toggleLogout, resetLogout, openLogout, closeLogout } = logoutSlice.actions;

export const logoutReducer = logoutSlice.reducer;


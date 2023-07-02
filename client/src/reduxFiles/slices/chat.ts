import { createSlice } from "@reduxjs/toolkit";


const initialState: Boolean = false;

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleChat: (state) => !state,
        resetChat: () => false,
        openChat: () => true,
        closeChat: () => false
    }
})

export const { toggleChat, resetChat, openChat, closeChat } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

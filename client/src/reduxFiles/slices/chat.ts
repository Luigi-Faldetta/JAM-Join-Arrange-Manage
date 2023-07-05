import { createSlice } from "@reduxjs/toolkit";


const initialState: {
    isOpen: boolean,
    eventId: string
} = {
    isOpen: false,
    eventId: ""
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleChat: (state) =>( {...state, isOpen: !state.isOpen}),
        resetChat:() =>initialState,
        openChat: (state) =>({...state, isOpen: true}),
        closeChat:  (state) => ({eventId:'', isOpen: false}),
        openWithEventId: (_, action) => {
            return {eventId: action.payload, isOpen: true}
        }
    }
})

export const { toggleChat, resetChat, openChat, closeChat, openWithEventId } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

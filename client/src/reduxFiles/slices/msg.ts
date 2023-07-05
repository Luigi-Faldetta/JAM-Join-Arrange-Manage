import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface MsgState {
    //update interface once types are declared
    id?:number,
    userId: string, 
    eventId: string, 
    message: string,
    User?: any
}

const initialMsgState:MsgState = {
    userId: "", 
    eventId: "", 
    message: "",
    User: {}
}

export const msgSlice = createSlice({
    name: "msg",
    initialState: initialMsgState,
    reducers: {
        //state type will be Expense when the type is created.
        createMsg: (state) => { state.message = ""},
    }
})

export const msgListSlice = createSlice({
    name: "messages",
    initialState: [] as MsgState[],
    reducers: {
        //state type will be Expense when the type is created.
        setMessages: (_state, action) => {
            return action.payload
        },
        addMessage: (state, action) => {
            const itsAlreadyThere = state.some(msg => msg.id === action.payload.id);
            if (itsAlreadyThere) {
                return state;
            }
            state.push(action.payload);
        },
    }
});

export const { createMsg } = msgSlice.actions
export const { setMessages, addMessage} = msgListSlice.actions

const msgReducer = msgSlice.reducer
const msgListReducer = msgListSlice.reducer

export default {msgListReducer, msgReducer}
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface EventState {
    //update interface once types are declared
    value: string
}


const initialEventState:EventState = {
    value: ""
}


export const eventSlice = createSlice({
    name: "event",
    initialState: initialEventState,
    reducers: {
        //state type will be Event when the type is created.
        createEvent: (state) => { state.value = ""},
        deleteEvent: (state) => { state.value = ""},
        updateEvent: (state) => { state.value = ""},
    }
})

export const eventListSlice = createSlice({
    name: "eventList",
    initialState: [] as EventState[],
    reducers: {
        //state type will be Event when the type is created.
        createEventList: (state) => { state = []},
        deleteEventList: (state) => { state = []},
        updateEventList: (state) => { state = []},
    }
})

export const { createEvent, updateEvent, deleteEvent } = eventSlice.actions
export const { createEventList, updateEventList, deleteEventList } = eventListSlice.actions

const eventReducer = eventSlice.reducer
const eventListReducer = eventListSlice.reducer

export default {eventListReducer, eventReducer}
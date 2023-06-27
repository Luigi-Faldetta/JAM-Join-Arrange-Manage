import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface EventState {
    //update interface once types are declared
    value: string
}

export interface EventListState {
    //update interface once types are declared
    value:EventState[]
}

const initialEventState:EventState = {
    value: ""
}

const initialEventListState: EventListState = {
    value: [],
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
    initialState: initialEventListState,
    reducers: {
        //state type will be Event when the type is created.
        createEventList: (state) => { state.value = []},
        deleteEventList: (state) => { state.value = []},
        updateEventList: (state) => { state.value = []},
    }
})

export const { createEvent, updateEvent, deleteEvent } = eventSlice.actions
export const { createEventList, updateEventList, deleteEventList } = eventListSlice.actions

const eventReducer = eventSlice.reducer
const eventListReducer = eventListSlice.reducer

export default {eventListReducer, eventReducer}
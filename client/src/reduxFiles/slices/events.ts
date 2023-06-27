import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface EventState {
  //update interface once types are declared
  eventName: string;
  eventDateAndTime: Date | null;
  eventLocation: string | null;
  eventDescription: string | null;
  eventHost: string[];
  eventAttendees: string[];
}

export interface EventListState {
  //update interface once types are declared
  value: EventState[];
}

const initialEventState: EventState = {
  //   value: {
  eventName: "",
  eventDateAndTime: null,
  eventLocation: "",
  eventDescription: "",
  eventHost: [],
  eventAttendees: [],
  //   },
};

const initialEventListState: EventListState = {
  value: [],
};

export const eventSlice = createSlice({
  name: "event",
  initialState: initialEventState,
  reducers: {
    //state type will be Event when the type is created.
    createEvent: (
      state = initialEventState,
      action: PayloadAction<EventState>
    ) => {
      state = action.payload;
      console.log("state test", state);
    },
    deleteEvent: (state) => {
      state = state;
    },
    updateEvent: (state) => {
      state = state;
    },
  },
});

export const eventListSlice = createSlice({
  name: "eventList",
  initialState: initialEventListState,
  reducers: {
    //state type will be Event when the type is created.
    createEventList: (state) => {
      state.value = [];
    },
    deleteEventList: (state) => {
      state.value = [];
    },
    updateEventList: (state) => {
      state.value = [];
    },
  },
});

export const { createEvent, updateEvent, deleteEvent } = eventSlice.actions;
export const { createEventList, updateEventList, deleteEventList } =
  eventListSlice.actions;

const eventReducer = eventSlice.reducer;
const eventListReducer = eventListSlice.reducer;

export default { eventListReducer, eventReducer };

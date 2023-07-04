import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface EventState {
  //update interface once types are declared
  eventId?: string;
  title: string;
  date: Date | null;
  location: string | null;
  description: string | null;
  eventHost: string;
  UserEvents: any[];
  coverPic?: string;
}

const initialEventState: EventState = {
  //   value: {
  title: "",
  date: null,
  location: "",
  description: "",
  eventHost: "",
  UserEvents: [],
  //   },
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
      // console.log("state test", state);
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
  initialState: [] as EventState[],
  reducers: {
    //state type will be Event when the type is created.
    createEventList: (state) => {
      state = [];
    },
    deleteEventList: (state) => {
      state = [];
    },
    updateEventList: (state) => {
      state = [];
    },
    deleteEventFromList: (state, action) => {
      console.log("REDUX DEUB SESH ==> ", action.payload);
      return [...state].filter((ev) => {
        console.log("REDUX V@ ==> ", ev.eventId, ev.eventId !== action.payload);
        return ev.eventId !== action.payload;
      });
    },
    addEventToList: (state, action) => {
      console.log("Event in redux :  ", action.payload);
      return [...state, action.payload];
    },
    setEventList: (_state, action) => {
      // console.log(action);
      return action.payload;
    },
  },
});

export const { createEvent, updateEvent, deleteEvent } = eventSlice.actions;
export const {
  createEventList,
  updateEventList,
  deleteEventList,
  setEventList,
  deleteEventFromList,
  addEventToList,
} = eventListSlice.actions;

const eventReducer = eventSlice.reducer;
const eventListReducer = eventListSlice.reducer;

export default { eventListReducer, eventReducer };

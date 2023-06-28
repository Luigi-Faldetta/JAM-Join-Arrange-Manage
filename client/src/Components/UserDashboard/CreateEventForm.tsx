import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import {
  createEvent,
  EventState,
  // initialEventState,
} from "../../reduxFiles/slices/events";

function CreateEventForm() {
  const dispatch = useDispatch();

  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //removed as it was preventing modal from closing
    const eventFormData: EventState = {
      eventName: event.currentTarget.eventName.value,
      eventDateAndTime: eventDate,
      eventLocation: event.currentTarget.eventLocation.value,
      eventDescription: event.currentTarget.eventDescription.value,
      // eventHost and eventAttendees need to be updated to
      // reflect hostID after login.
      eventHost: "hostId",
      eventAttendees: ["hostId"],
    };

    console.log("in component", eventFormData);

    dispatch(createEvent(eventFormData));
    setOpen(false);
  };

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        Host event
      </button>
      <dialog id="my_modal_3" className="modal" open={open}>
        <form method="dialog" className="modal-box" onSubmit={handleFormSubmit}>
          <div
            onClick={() => setOpen(false)}
            className="btn btn-circle absolute right-2 top-2"
          >
            ✕
          </div>
          <h3 className="font-bold text-lg">Add the event details here:</h3>

          <div className="mb-6">
            <label
              htmlFor="eventName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Event Name
            </label>
            <input
              type="eventName"
              id="eventName"
              name="eventName"
              maxLength={30}
              className="shadow-sm 
              
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5 
                          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Eg. 'Anna's houseparty...'"
              required
            />
          </div>

          <div className="mb-6  w-full ">
            <label
              htmlFor="eventDateAndTime"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Event Date & Time
            </label>
            <DatePicker
              selectsStart
              placeholderText="Select date & time"
              showTimeSelect
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              dateFormat="EEE MMM d 🗓 h:mm aa 🕣"
              minDate={new Date()}
              wrapperClassName="w-full"
              className="shadow-sm 
                         bg-gray-50 
                         border border-gray-300 
                         text-gray-900 text-sm 
                         rounded-lg 
                         focus:ring-blue-500 
                         focus:border-blue-500 
                         block 
                         w-full
                         p-2.5 
                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="eventLocation"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Location
            </label>
            <input
              type="eventLocation"
              id="eventLocation"
              name="eventLocation"
              placeholder="Eg. '12345 Rainbow Lane...'"
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5 
                          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="eventDescription"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <input
              type="eventDescription"
              id="eventDescription"
              name="eventDescription"
              placeholder="Eg. 'Music will be pumping, the dance floor will be on fire' "
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5 
                          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>

          <button
            type="submit"
            className="text-white 
                        bg-blue-700 hover:bg-blue-800 
                        focus:ring-4 focus:outline-none focus:ring-blue-300 
                        font-medium 
                        rounded-lg 
                        text-sm 
                        px-5 py-2.5 
                        text-center 
                        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Event
          </button>
        </form>
      </dialog>
    </>
  );
}

export default CreateEventForm;

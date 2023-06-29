import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import {
  createEvent,
  EventState,
  // initialEventState,
} from "../../reduxFiles/slices/events";
// import PictureUpload from "../PictureUpload";
import { useAddEventMutation } from "../../services/ThesisDB";
import { ApiResponse } from "../../services/ApiResponseType";

function CreateEventForm() {
  const dispatch = useDispatch();

  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [addEvent] = useAddEventMutation();

  const handleImageUpload = async () => {
    if (eventFile) {
      const data = new FormData();
      data.append("file", eventFile);
      data.append("upload_preset", "tdzb6v4z");
      data.append("cloud_name", "de4bu4ijj");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/de4bu4ijj/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        const uploadedImage = await res.json();

        console.log(uploadedImage.url);

        // Send the url to the backend to update the post

        console.log("Image form cloudinary ==> ", uploadedImage);
        return uploadedImage;
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //removed as it was preventing modal from closing

    const eventFormData: EventState = {
      title: event.currentTarget.eventName.value,
      date: eventDate,
      location: event.currentTarget.eventLocation.value,
      description: null,
      // eventImage: image.url,
      // eventHost and eventAttendees need to be updated to
      // reflect hostID after login.
      eventHost: "hostId",
      eventAttendees: ["hostId"],
    };

    const image = await handleImageUpload();
    console.log(image);

    eventFormData.coverPic = image.url;
    console.log("in component", eventFormData);

    const eventCreated = await addEvent(eventFormData);
    console.log("event created == > ", eventCreated);
    dispatch(createEvent((eventCreated as ApiResponse<EventState>).data));
    setOpen(false);
  };

  function createModal() {
    return open ? (
      <dialog id="my_modal_3" className="modal" open={open}>
        <form method="dialog" className="modal-box" onSubmit={handleFormSubmit}>
          <div
            onClick={() => setOpen(false)}
            className="btn btn-circle absolute right-2 top-2"
          >
            ✕
          </div>

          {/* -------- image upload and event name container --------- */}
          <div className="flex flex-col justify-center text-center bg-gray-100 rounded-md p-4 mb-5">
            {/* <PictureUpload file={file} setFile={setFile}></PictureUpload> */}

            <div className="">
              <label
                htmlFor="eventName"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Event Name
              </label>
              <input
                // type="eventName"
                id="eventName"
                name="eventName"
                maxLength={30}
                className="shadow-sm 
              
                          bg-gray-50 border border-gray-300 
                          rounded-lg 
                          text-gray-900 text-sm 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5 
                          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Eg. 'Anna's houseparty...'"
                required
              />
            </div>
          </div>
          {/* -------- image upload and event name container --------- */}

          <div className="mb-4  w-full ">
            <label
              htmlFor="eventDateAndTime"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Date & Time
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

          <div className="mb-5">
            <label
              htmlFor="eventLocation"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Location
            </label>
            <input
              // type="eventLocation"
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
          {/* <div className="mb-6">
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
          </div> */}
          <div className="mb-5">
            <label
              htmlFor="eventLocation"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Image
            </label>

            <input
              id="dropzone-file"
              type="file"
              className="shadow-sm 
            bg-gray-50 border border-gray-300 
            text-gray-900 text-sm 
            rounded-lg 
            focus:ring-blue-500 focus:border-blue-500 
            block w-full 
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              onChange={(e) => setEventFile(e.target.files?.[0]!)}
            />
          </div>

          <button
            type="submit"
            className="text-white 
                        bg-gradient-to-r from-red-500 to-red-600 hover:bg-blue-800 
                        focus:ring-4 focus:outline-none focus:ring-blue-300 
                        font-medium 
                        w-full
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
    ) : null;
  }

  useEffect(() => {
    console.log("open ==> ", open);
  }, []);

  return (
    <>
      <button
        className="btn"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((st) => !st);
        }}
      >
        Host event
      </button>
      {createModal()}
    </>
  );
}

export default CreateEventForm;

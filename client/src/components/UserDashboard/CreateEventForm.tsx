import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import {
  addEventToList,
  setEvent,
  EventState,
} from '../../reduxFiles/slices/events';
import { useAddEventMutation } from '../../services/JamDB';
import { ApiResponse } from '../../services/ApiResponseType';
import { motion, AnimatePresence } from 'framer-motion';

// Import react-icons
import {
  FiPlus,
  FiX,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiImage,
  FiLoader,
} from 'react-icons/fi';

function CreateEventForm() {
  const dispatch = useDispatch();
  const userToken = localStorage.getItem('token');

  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addEvent] = useAddEventMutation();

  // Generate image preview
  useEffect(() => {
    if (eventFile) {
      const url = URL.createObjectURL(eventFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [eventFile]);

  const handleImageUpload = async () => {
    if (eventFile) {
      const data = new FormData();
      data.append('file', eventFile);
      data.append('upload_preset', 'tdzb6v4z');
      data.append('cloud_name', 'de4bu4ijj');

      try {
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/de4bu4ijj/image/upload',
          {
            method: 'post',
            body: data,
          }
        );

        const uploadedImage = await res.json();

        return uploadedImage;
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const eventFormData: Partial<EventState> &
      Pick<EventState, 'title' | 'date' | 'location' | 'description'> = {
      title: event.currentTarget.eventName.value,
      date: eventDate,
      location: event.currentTarget.eventLocation.value,
      description: event.currentTarget.eventDescription.value,
    };

    const image = await handleImageUpload();

    if (image?.secure_url) eventFormData.coverPic = image.url;

    const eventCreated = await addEvent({
      token: userToken as string,
      event: eventFormData,
    });

    if ('data' in eventCreated && eventCreated.data.success) {
      dispatch(setEvent(eventCreated.data.data));
      dispatch(addEventToList(eventCreated.data.data));
    }
    setIsLoading(false);
    setOpen(false);
  };

  function createModal() {
    return (
      <AnimatePresence>
        {open ? (
          <motion.dialog
            id="my_modal_3"
            className="modal h-screen "
            open={open}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full bg-gray-500/50 transition-opacity backdrop-blur "></div>

            <form
              method="dialog"
              className="modal-box border-indigo-950 border-2 fixed mx-auto bg-white"
              onSubmit={handleFormSubmit}
            >
              {/* Close Button with Icon */}
              <div
                onClick={() => setOpen(false)}
                className="btn btn-circle absolute right-2 top-2 bg-indigo-950 text-white hover:text-pink-500 hover:bg-indigo-950 flex items-center justify-center"
                style={{ cursor: 'pointer' }}
              >
                <FiX size={20} />
              </div>

              <div className="flex flex-col justify-center text-center bg-gray-100 rounded-md p-4 mb-5">
                <div className="">
                  <label
                    htmlFor="eventName"
                    className="block mb-2 text-md font-medium text-gray-900 flex items-center gap-2"
                  >
                    <FiPlus className="inline mr-1" />
                    Event Name
                  </label>
                  <input
                    id="eventName"
                    name="eventName"
                    maxLength={30}
                    className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          rounded-lg 
                          text-gray-900 text-sm 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5 "
                    placeholder="Eg. 'Anna's houseparty...'"
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="mb-4  w-full ">
                <label
                  htmlFor="eventDateAndTime"
                  className="block mb-2 text-sm font-medium text-gray-900 flex items-center gap-2"
                >
                  <FiCalendar className="inline mr-1" />
                  Date & Time
                </label>
                <DatePicker
                  selectsStart
                  placeholderText="Select date & time"
                  showTimeSelect
                  id="event-date"
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
                         p-2.5"
                  autoComplete="off"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="eventDescription"
                  className="block mb-2 text-sm font-medium text-gray-900 flex items-center gap-2"
                >
                  <FiFileText className="inline mr-1" />
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
                          block w-full p-2.5"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="eventLocation"
                  className="block mb-2 text-sm font-medium text-gray-900 flex items-center gap-2"
                >
                  <FiMapPin className="inline mr-1" />
                  Location
                </label>
                <input
                  id="eventLocation"
                  name="eventLocation"
                  placeholder="Eg. '12345 Rainbow Lane...'"
                  className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="eventLocation"
                  className="block mb-2 text-sm font-medium text-gray-900 flex items-center gap-2"
                >
                  <FiImage className="inline mr-1" />
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
                block w-full "
                  onChange={(e) => setEventFile(e.target.files?.[0]!)}
                />
                {previewUrl && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-28 object-cover rounded-lg border border-gray-200 shadow"
                    />
                  </div>
                )}
              </div>

              <button
                id="create-event-btn"
                type="submit"
                className="text-white hover:text-pink-500
                            font-bold 
                            bg-gradient-to-r from-indigo-900 to-indigo-950  
                            focus:ring-4 focus:outline-none focus:ring-blue-300 
                            w-full
                            rounded-lg 
                            text-sm 
                            px-5 py-2.5 
                            mt-8
                            text-center flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiPlus className="inline mr-2" />
                    Create Event
                  </>
                )}
              </button>
            </form>
          </motion.dialog>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <>
      <div className="w-full flex justify-center lg:justify-end">
        <button
          className="btn bg-pink-100 text-slate-600 w-1/2 mb-6 border-0 hover:bg-pink-500 flex items-center justify-center gap-2"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setOpen((st) => !st);
          }}
        >
          <FiPlus className="inline mr-1" />
          Host event
        </button>
        {createModal()}
      </div>
    </>
  );
}

export default CreateEventForm;

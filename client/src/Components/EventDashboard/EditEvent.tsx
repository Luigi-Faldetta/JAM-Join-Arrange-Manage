import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteEventMutation,
  useUpdateEventMutation,
} from "../../services/ThesisDB";
import { useState } from "react";
import DatePicker from "react-datepicker";
import {
  addEventToList,
  EventState,
  updateEvent,
} from "../../reduxFiles/slices/events";
import { RootState } from "../../reduxFiles/store";

interface EditEventProps {
  setEditModalOpen: (isOpen: boolean) => void;
}

function EditEvent({ setEditModalOpen, eventid }: any) {
  const eventInfo = useSelector((state: RootState) => state.eventReducer);
  const dispatch = useDispatch();
  const [eventFile, setEventFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [patchEvent] = useUpdateEventMutation();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    const eventFormData: Partial<EventState> &
      Pick<EventState, "title" | "date" | "location" | "description"> = {
      title: event.currentTarget.eventName.value,
      date: eventDate,
      location: event.currentTarget.eventLocation.value,
      description: null,
      eventId: eventid,
    };

    const image = await handleImageUpload();

    eventFormData.eventId = eventid;
    if (image?.url) eventFormData.coverPic = image.url;
    if (title !== "") {
      eventFormData.title = title;
    } else {
      //@ts-ignore
      delete eventFormData.title;
    }

    if (date !== null) {
      eventFormData.date = date;
    } else {
      //@ts-ignore
      delete eventFormData.date;
    }
    if (location !== "") {
      eventFormData.location = location;
    } else {
      //@ts-ignore
      delete eventFormData.location;
    }
    if (description !== "") {
      eventFormData.description = description;
    } else {
      //@ts-ignore
      delete eventFormData.description;
    }

    const eventChanged = await patchEvent(eventFormData);
    if ("data" in eventChanged && eventChanged.data.success) {
      dispatch(updateEvent(eventChanged.data.data));
    }
    setEditModalOpen(false);
  };
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

        return uploadedImage;
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };
  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <form
          method=""
          className="modal-box border-indigo-950 border-2 bg-white"
          onSubmit={handleFormSubmit}
        >
          <div
            onClick={() => setEditModalOpen(false)}
            className="btn btn-circle absolute right-2 top-2 bg-indigo-950 text-white hover:text-pink-500 hover:bg-indigo-950"
          >
            ✕
          </div>

          <div className="flex flex-col justify-center text-center bg-gray-100 rounded-md p-4 mb-5">
            <div className="">
              <label
                htmlFor="eventName"
                className="block mb-2 text-md font-medium text-gray-900"
              >
                Event Name
              </label>
              <input
                id="eventName"
                name="eventName"
                maxLength={30}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow-sm 
              
                          bg-gray-50 border border-gray-300 
                          rounded-lg 
                          text-gray-900 text-sm 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
                placeholder="Eg. 'Anna's houseparty...'"
              />
            </div>
          </div>

          <div className="mb-4  w-full ">
            <label
              htmlFor="eventDateAndTime"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Date & Time
            </label>
            <DatePicker
              selectsStart
              placeholderText="Select date & time"
              showTimeSelect
              id="event-date"
              selected={eventDate}
              onChange={(date) => setDate(date)}
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
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="eventDescription"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <input
              type="eventDescription"
              id="eventDescription"
              name="eventDescription"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Eg. 'Music will be pumping, the dance floor will be on fire' "
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="eventLocation"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Location
            </label>
            <input
              id="eventLocation"
              name="eventLocation"
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Eg. '12345 Rainbow Lane...'"
              className="shadow-sm 
                          bg-gray-50 border border-gray-300 
                          text-gray-900 text-sm 
                          rounded-lg 
                          focus:ring-blue-500 focus:border-blue-500 
                          block w-full p-2.5"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="eventLocation"
              className="block mb-2 text-sm font-medium text-gray-900"
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
            block w-full"
              onChange={(e) => setEventFile(e.target.files?.[0]!)}
            />
          </div>

          <button
            id="create-event-btn"
            type="submit"
            className="text-white hover:text-pink-500

                        bg-gradient-to-r from-indigo-900 to-indigo-950  
                        focus:ring-4 focus:outline-none focus:ring-blue-300 
                        font-medium 
                        w-full
                        rounded-lg 
                        text-sm 
                        px-5 py-2.5 
                        mt-8
                        text-center"
          >
            Edit Event
          </button>
        </form>
      </div>{" "}
    </>
  );
}
export default EditEvent;

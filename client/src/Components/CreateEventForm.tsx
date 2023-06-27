import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

declare global {
  interface Window {
    my_modal_3: {
      showModal: () => void;
    };
  }
}

function CreateEventForm() {
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <>
      <button className="btn" onClick={() => window.my_modal_3.showModal()}>
        Host event
      </button>
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg">Add the event details here:</h3>

          <form>
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
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Eg. 'Anna's houseparty...'"
                required
              />
            </div>
            <label
              htmlFor="eventName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Event Time & Date
            </label>
            <div
              className="flex justify-center gap-2 mb-6 w-full"
              id="eventDateAndTime"
            >
              <label
                htmlFor="eventName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              ></label>
              <DatePicker
                selectsStart
                placeholderText="Select start date"
                showTimeSelect
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="EEE MMM d 🗓 h:mm aa 🕣"
                minDate={new Date()}
                startDate={startDate}
                className="shadow-sm 
                         bg-gray-50 
                         border border-gray-300 
                         text-gray-900 text-sm 
                         rounded-lg 
                         focus:ring-blue-500 
                         focus:border-blue-500 
                         block 
                         w-full p-2.5 
                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              />

              {/* End date */}

              {/* <label
                htmlFor="eventName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              ></label>
              <DatePicker
                selectsEnd
                placeholderText="Select end date"
                showTimeSelect
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                endDate={endDate}
                startDate={startDate}
                dateFormat="EEE MMM d 🗓 h:mm aa 🕣"
                minDate={startDate}
                className="shadow-sm 
                         bg-gray-50 
                         border border-gray-300 
                         text-gray-900 text-sm 
                         rounded-lg 
                         focus:ring-blue-500 
                         focus:border-blue-500 
                         block 
                         w-full p-2.5 
                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              /> */}
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
                placeholder="Eg. '12345 Rainbow Lane...'"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="repeat-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <input
                type="password"
                id="repeat-password"
                placeholder="Eg. 'Music will be pumping, the dance floor will be on fire' "
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Create Event
            </button>
          </form>
        </form>
      </dialog>
    </>
  );
}

export default CreateEventForm;

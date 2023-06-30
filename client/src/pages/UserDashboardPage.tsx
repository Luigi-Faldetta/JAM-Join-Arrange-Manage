import CreateEventForm from "../Components/UserDashboard/CreateEventForm";
import EventTile from "../Components/UserDashboard/EventTile";
import { EventState, createEventList } from "../reduxFiles/slices/events";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../reduxFiles/store";
import { useGetEventsQuery } from "../services/ThesisDB";
import { useEffect, useState } from "react";
import { setEventList } from "../reduxFiles/slices/events";

//MOVE TO EVENT PAGE
import DeleteEvent from "../Components/Event/DeleteEvent";
//MOVE TO EVENT PAGE

function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const eventList = useSelector((state: RootState) => state.eventListReducer);
  const { data, error, isLoading } = useGetEventsQuery(
    "57cb0816-b2f3-43f2-86d4-71cfa16ad6ad"
  );

  useEffect(() => {
    if (!isLoading && !error) {
      console.log("event list ==> ", data?.data);
      dispatch(setEventList(data?.data));
    }
  }, [isLoading, error]);

  useEffect(() => {
    console.log("Event list has changed ==> ", eventList);
  }, [eventList]);
  // add fetch to get all the events

  // THIS NEEDS TO BE MOVED TO THE EVENT PAGE
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
    console.log("event delete button clicked");
  };
  // SECTION TO BE MOVED TO EVENT PAGE

  return (
    <>
      {/* THIS NEEDS TO BE MOVED TO THE EVENT PAGE */}
      <button
        onClick={() => openDeleteModal()}
        className="dropdown-item inline-flex w-full justify-center px-3 py-2  text-white focus:outline-none focus:ring-red-300 rounded-md bg-red-600 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-800 sm:ml-3 sm:w-auto"
      >
        DELETE
      </button>

      {deleteModalOpen && (
        <DeleteEvent setDeleteModalOpen={setDeleteModalOpen} />
      )}
      {/* THIS NEEDS TO BE MOVED TO THE EVENT PAGE */}

      <div className="flex flex-col justify-center items-center">
        <div className="m-5 h-full p-5 flex flex-col items-center gap-5">
          <CreateEventForm></CreateEventForm>
        </div>

        <div className=" h-full p-5 flex flex-col items-center gap-5">
          {eventList ? (
            eventList.map((event: EventState) => {
              return <EventTile event={event}></EventTile>;
            })
          ) : (
            <h3>No Upcoming Events</h3>
          )}
        </div>
      </div>
    </>
  );
}

export default UserDashboardPage;

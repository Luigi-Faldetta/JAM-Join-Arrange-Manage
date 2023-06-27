import CreateEventForm from "./CreateEventForm";
import EventTile from "./EventTile";
import { createEventList } from "../../reduxFiles/slices/events";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxFiles/store";

function UserDashboardPage() {
  const eventList = useSelector((state: RootState) => state.eventListReducer);

  return (
    <>
      <div className="flex flex-row">
        <div className="m-5 w-1/2 h-full flex flex-col gap-5">
          {/* {eventList ? (
            eventList.map((event) => {
              return <EventTile></EventTile>;
            })
          ) : (
            <h3>No Upcoming Events</h3>
          )} */}

          <EventTile></EventTile>
          <EventTile></EventTile>
        </div>
        <div className="m-5 w-1/2 aspect-w-1 aspect-h-1">
          <div className="mb-5 flex justify-end">
            <CreateEventForm></CreateEventForm>
          </div>
          {/* <div className="bg-green-500 h-64">empty</div> */}
        </div>
      </div>
    </>
  );
}

export default UserDashboardPage;

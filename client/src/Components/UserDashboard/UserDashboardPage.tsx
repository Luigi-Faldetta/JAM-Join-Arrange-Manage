import CreateEventForm from "./CreateEventForm";
import EventTile from "./EventTile";
import { createEventList } from "../../reduxFiles/slices/events";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxFiles/store";

function UserDashboardPage() {
  const eventList = useSelector((state: RootState) => state.eventListReducer);

  // add fetch to get all the events

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="m-5 h-full p-5 flex flex-col items-center gap-5">
          <CreateEventForm></CreateEventForm>
        </div>

        <div className=" h-full p-5 flex flex-col items-center gap-5">
          {/* {eventList ? (
            eventList.map((event) => {
              return <EventTile event={event}></EventTile>;
            })
          ) : (
            <h3>No Upcoming Events</h3>
          )} */}

          <EventTile></EventTile>
          <EventTile></EventTile>
        </div>
      </div>
    </>
  );
}

export default UserDashboardPage;

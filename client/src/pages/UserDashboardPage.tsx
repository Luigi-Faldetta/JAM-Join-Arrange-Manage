import CreateEventForm from "../Components/UserDashboard/CreateEventForm";
import EventTile from "../Components/UserDashboard/EventTile";
import { EventState } from "../reduxFiles/slices/events";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../reduxFiles/store";
import { useGetEventsQuery } from "../services/ThesisDB";
import { useEffect, useState } from "react";
import { setEventList } from "../reduxFiles/slices/events";
import moment from "moment";
import EventCalendar from "../Components/UserDashboard/EventCalendar";

function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const userToken = localStorage.getItem("token");

  const eventList = useSelector((state: RootState) => state.eventListReducer);
  const { data, error, isLoading } = useGetEventsQuery(userToken as string);

  const [showAllEvents, setShowEvents] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !error) {
      dispatch(setEventList(data?.data));
    }
  }, [isLoading, error, data]);

  const sortedEventList = eventList
    .slice()
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  const handleToggle = (eventType: string) => {
    //@ts-ignore
    setShowEvents(eventType);
  };

  function AllEvents({ sortedEventList }: { sortedEventList: any }) {
    return (
      <>
        {" "}
        {sortedEventList.length >= 1 &&
          sortedEventList.map((event: EventState) => {
            return <EventTile key={event.eventId} event={event}></EventTile>;
          })}
      </>
    );
  }

  function HostedEvents({ sortedEventList }: { sortedEventList: any }) {
    return (
      <>
        {sortedEventList.map((event: EventState) => {
          if (event.UserEvents[0].isHost === true) {
            return <EventTile key={event.eventId} event={event} />;
          }
          <h3 className="w-full">You are not hosting any events</h3>; // Return null for non-hosted events or handle them differently
        })}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-center align-top top-0 gap-14">
        <div className=" p-5 flex flex-col justify-start items-center gap-1 align-top w-1/3 h-screen">
          <div className=" bg-yellow-30">
            {isLoading && <h2>Loading...</h2>}

            {!isLoading && sortedEventList.length < 1 && (
              <div className="flex flex-col justify-center align-middle text-center">
                <div className=" self-center">
                  <img src="sad-jam.png" className="max-w-[150px]" />
                </div>
                <div>
                  <h3>No upcoming events yet. Click "Host Event" to begin.</h3>
                </div>
              </div>
            )}
            {sortedEventList.length >= 1 && (
              <div className="w-full flex flex-row align-top justify-center  ">
                <button
                  onClick={() => handleToggle("all")}
                  className="btn bg-pink-500 hover:bg-pink-700 text-white w-1/2"
                >
                  ALL
                </button>
                <button
                  onClick={() => handleToggle("host")}
                  className="btn bg-pink-500 hover:bg-pink-700 text-white w-1/2"
                >
                  HOSTING
                </button>
              </div>
            )}
            <div>
              {showAllEvents === "all" ? (
                <AllEvents sortedEventList={sortedEventList} />
              ) : (
                <HostedEvents sortedEventList={sortedEventList} />
              )}
            </div>
          </div>
        </div>

        <div className=" p-5 flex flex-col justify-start items-center gap-1 align-top w-1/3 ">
          <CreateEventForm></CreateEventForm>
          <EventCalendar sortedEventList={sortedEventList}></EventCalendar>
        </div>
      </div>
    </>
  );
}

export default UserDashboardPage;

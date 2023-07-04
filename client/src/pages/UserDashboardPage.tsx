import CreateEventForm from "../Components/UserDashboard/CreateEventForm";
import EventTile from "../Components/UserDashboard/EventTile";
import { EventState, createEventList } from "../reduxFiles/slices/events";
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

  useEffect(() => {
    if (!isLoading && !error) {
      dispatch(setEventList(data?.data));
    }
  }, [isLoading, error, data]);

  // const sortedList = eventList.sort((a, b)=>{
  //   return moment(a.date).valueOf() - moment(b.date).valueOf();
  // } )

  const sortedEventList = eventList
    .slice()
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  useEffect(() => {
    console.log("Event list has changed ==> ", eventList);
  }, [eventList]);

  // const hostedEvents = eventList.

  return (
    <>
      <div className="flex flex-row justify-center  ">
        <div className=" p-5 flex flex-col justify-center items-center gap-1 ">
          {isLoading && <h2>loading...</h2>}
          {sortedEventList.length >= 1 &&
            sortedEventList.map((event: EventState) => {
              return <EventTile event={event}></EventTile>;
            })}

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
        </div>

        <div className="sticky top-0 flex-shrink-0 max-h-screen overflow-y-auto w-1/3">
          <div className="m-5 p-5 flex flex-col  gap-5">
            <CreateEventForm></CreateEventForm>
            <EventCalendar sortedEventList={sortedEventList}></EventCalendar>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboardPage;

import { useEffect, useState } from "react";
import EventData from "../../components/EventDashboard/EventData";
import { useParams } from "react-router-dom";
import Todos from "../../components/EventDashboard/Todos";
import Expenses from "../../components/EventDashboard/Expenses";
import Attendees from "../../components/EventDashboard/Attendees";
import { useGetEventQuery } from "../../services/JamDB";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import { EventState } from "../../reduxFiles/slices/events";
import "./EventDashboard.css";
import LandingPage from "../LandingPage/LandingPage";

export default function EventDashboard() {
  const [userIsHost, setUserIsHost] = useState<boolean>(false);
  const [showTodos, setShowTodos] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const loggedUser = localStorage.getItem("token");
  const isLoggedIn = useIsLoggedIn();
  const { eventid } = useParams();
  const {
    data: eventData,
    isLoading,
  } = useGetEventQuery(eventid as string);

  useEffect(() => {
    const hostUser = eventData?.data.UserEvents.find(
      (user: EventState["UserEvents"][0]) => user.isHost
    );
    setUserIsHost(hostUser?.userId === loggedUser ? true : false);

    if (!eventData || !eventData?.data || !eventData?.data?.UserEvents.length) {
      if (isJoined) {
        setIsJoined(false);
      }
      return;
    }

    const isJoinedCheck = eventData.data.UserEvents.reduce(
      (acc: any, cur: any) => {
        if (cur.userId === loggedUser) {
          return true;
        } else {
          return acc;
        }
      },
      false
    );

    if (isJoinedCheck !== isJoined) {
      setIsJoined(isJoinedCheck);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData, loggedUser]);

  return (
    <>
      {isLoggedIn && !isLoading && eventData ? (
        <>
          <div className="flex flex-col items-center gap-4">
            <div className="w-11/12 md:w-4/5">
              <EventData
                eventData={eventData}
                userIsHost={userIsHost}
                showTodos={showTodos}
                setShowTodos={setShowTodos}
                isJoined={isJoined}
                loggedUser={loggedUser}
                setIsJoined={setIsJoined}
                isLoading={isLoading}
              />

            </div>

            <div className="w-11/12 md:w-4/5">{showTodos ? <Todos /> : <Expenses />}</div>

            <div className="w-11/12 md:w-4/5 flex flex-row justify-start mb-5 h-28 md:h-36 bg-gradient-to-r from-gray-300 via-gray-300 to-gray-300 border-2 border-slate-400 rounded-xl overflow-hidden">
              <Attendees />
            </div>
          </div>
        </>
      ) : (
        <>
          <LandingPage eventData={eventData} />
        </>
      )}
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import EventData from "../EventDashboard/EventData";
import ToggleButton from "../EventDashboard/ToggleButton";
import { useParams } from "react-router-dom";
import Todos from "../EventDashboard/Todos";
import Expenses from "../EventDashboard/Expenses";
import Attendees from "../EventDashboard/Attendees";
import { useGetEventQuery } from "../../services/ThesisDB";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import { EventState } from "../../reduxFiles/slices/events";
import EventLink from "../EventDashboard/EventLink";
import "./EventDashboard.css"
import LandingPage from "../../pages/LandingPage/LandingPage";

export default function Event() {
  const [userIsHost, setUserIsHost] = useState<boolean>(false);
  const [showTodos, setShowTodos] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const loggedUser = localStorage.getItem("token");
  const isLoggedIn = useIsLoggedIn();
  const { eventid } = useParams();
  const {
    data: eventData,
    error,
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

    const isJoinedCheck = eventData.data.UserEvents.reduce((acc: any, cur: any) => {
      if (cur.userId === loggedUser) {
        return true;
      } else {
        return acc;
      }
    }, false);

    if (isJoinedCheck !== isJoined) {
      setIsJoined(isJoinedCheck);
    }
  }, [eventData, loggedUser]);


  return (
    <>
      {isLoggedIn && !isLoading && eventData ? (<>

        <div className="flex flex-col items-center gap-4">
          <div className="w-4/5">

            <EventData eventData={eventData} userIsHost={userIsHost} showTodos={showTodos} setShowTodos={setShowTodos}/>

            <ToggleButton
              isJoined={isJoined}
              loggedUser={loggedUser}
              setIsJoined={setIsJoined}
              isLoading={isLoading}
            />

          </div>

          <div className="w-4/5">
            {showTodos ? (<Todos />) : (<Expenses />)}
          </div>

          <div className="w-4/5 h-36 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-xl" >
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

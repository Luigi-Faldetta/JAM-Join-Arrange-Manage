import { useEffect, useMemo, useState } from "react";
import EventMini from "../EventDashboard/EventMini";
import ToggleButton from "../EventDashboard/ToggleButton";
import { useParams } from "react-router-dom";
import Todos from "../EventDashboard/Todos";
import Expenses from "../EventDashboard/Expenses";
import Attendees from "../EventDashboard/Attendees";
import { useGetEventQuery } from "../../services/ThesisDB";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import { EventState } from "../../reduxFiles/slices/events";
import EventLink from "../EventDashboard/EventLink";

// Test for merging

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

  const handleToggle = () => {
    setShowTodos((prevShowTodos) => !prevShowTodos);
  };

  console.log("____________________________________eventdata==>", eventData);

  return (
    <>
      <div>
        {isLoggedIn && !isLoading && eventData ? (
          <>
            <EventMini eventData={eventData} userIsHost={userIsHost} />
          </>
        ) : (
          <div>test</div>
          // <LandingPage eventData={eventData} />
          // instead of going to landing page we should just show the modal
        )}

        <button
          onClick={handleToggle}
          className="absolute top-28 right-24 btn btn-primary"
        >
          {showTodos ? "Expenses" : "Todos"}
        </button>
        {showTodos ? (
          <>
            {" "}
            <Todos /> <Attendees />{" "}
          </>
        ) : (
          <Expenses />
        )}

        <ToggleButton 
          isJoined={isJoined} 
          loggedUser={loggedUser}
          setIsJoined={setIsJoined}
          isLoading={isLoading}
        />
        <EventLink eventid={eventid} />
      </div>
    </>
  );
}

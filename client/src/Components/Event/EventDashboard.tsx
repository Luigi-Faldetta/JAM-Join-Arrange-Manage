import { useEffect, useMemo, useState } from "react";
import EventMini from "../EventDashboard/EventMini";
import ToggleButton from "../EventDashboard/ToggleButton";
import { useParams } from "react-router-dom";
import Todos from "../EventDashboard/Todos";
import Expenses from "../EventDashboard/Expenses";
import Attendees from "../EventDashboard/Attendees";
import { useGetEventQuery } from "../../services/ThesisDB";
import { useAuth } from "../../utils/useAuth";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import LandingPage from "../../pages/LandingPage/LandingPage";
import { EventState } from "../../reduxFiles/slices/events";
import EventLink from "../EventDashboard/EventLink";
import DeleteEventButton from "../Event/DeleteEvent";

export default function Event() {
  const [userIsHost, setUserIsHost] = useState(false);
  const [showTodos, setShowTodos] = useState<boolean>(true);

  const loggedUser = localStorage.getItem("token");

  const isLoggedIn = useIsLoggedIn();
  const { eventid } = useParams();

  console.log("eventid in Event comp ==> ", eventid);

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
  }, [eventData]);

  useEffect(() => {
    console.log("ishost?=>", userIsHost);
  }, [userIsHost]);

  const handleToggle = () => {
    setShowTodos((prevShowTodos) => !prevShowTodos);
  };

  // console.log({ error, eventData });

  // const eventData = data?.data;
  console.log("eventdata==>", eventData);

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

        <ToggleButton eventData={eventData} />
        <EventLink eventid={eventid} />
      </div>
    </>
  );
}

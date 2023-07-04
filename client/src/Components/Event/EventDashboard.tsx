import { useEffect, useMemo, useState } from "react";
import EventMini from "../EventDashboard/EventMini";
import ToggleButton from "../EventDashboard/ToggleButton";
import { useParams } from "react-router-dom";
import { useGetEventQuery } from "../../services/ThesisDB";
import { useAuth } from "../../utils/useAuth";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import LandingPage from "../../pages/LandingPage/LandingPage";
import { EventState } from "../../reduxFiles/slices/events";

export default function Event() {
  const isLoggedIn = useIsLoggedIn();
  const { eventid } = useParams();


  const {
    data: eventData,
    error,
    isLoading,
  } = useGetEventQuery(eventid as string);


  // const eventData = data?.data;

  return (
    <>
      <div>
        {isLoggedIn && !isLoading && eventData ? (
          <>
            <EventMini eventData={eventData} />
            <ToggleButton eventData={eventData} />
          </>
        ) : (
          <div>test</div>
          // <LandingPage eventData={eventData} />
          // instead of going to landing page we should just show the modal
        )}
      </div>
    </>
  );
}

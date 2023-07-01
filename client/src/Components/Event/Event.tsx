import { useEffect, useMemo } from "react";
import EventMini from "../EventDashboard/EventMini";
import ToggleButton from "../EventDashboard/ToggleButton";
import { useParams } from 'react-router-dom';
import { useGetEventQuery } from "../../services/ThesisDB";
import { useAuth } from "../../utils/useAuth";
import LoginForm from "../LandingDashboard/LoginForm";
import CreateUserForm from "../LandingDashboard/CreateUserForm";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";

export default function Event() {
  const isLoggedIn = useIsLoggedIn();
  const { eventid } = useParams();
  const { data } = useGetEventQuery(eventid as string)
  console.log('data', data?.data.title);

  return (
    <>
    <div>
    {isLoggedIn ? (
        <>
          <EventMini></EventMini>
          <ToggleButton></ToggleButton>
        </>
      ) : (
        <div className="login-form  lg:flex lg:flex-col">
          <h2>If you want to join an {data?.data.title} log in first</h2>
        <LoginForm />
        <CreateUserForm />
      </div>
      )}
    </div>
  </>
  );
}

import { useEffect } from "react";
import EventMini from "../EventDashboard/EventMini";
import ToggleButton from "../EventDashboard/ToggleButton";
import { useParams } from 'react-router-dom';
import { useGetEventQuery } from "../../services/ThesisDB";
import { useAuth } from "../../utils/useAuth";
import LoginForm from "../LandingDashboard/LoginForm";
import CreateUserForm from "../LandingDashboard/CreateUserForm";

export default function Event() {

  const { eventid } = useParams();
  const { data } = useGetEventQuery(eventid as string)
  console.log('data', data?.data.title);

  const token = localStorage.getItem('token');
  console.log(token);



  return (
    <>
    <div>
      {token ? (
        <>
          <EventMini></EventMini>
          <ToggleButton></ToggleButton>
        </>
      ) : (
        <div className="login-form  lg:flex lg:flex-col">
          <h2>If you want to join an event log in first</h2>
        <LoginForm />
        <CreateUserForm />
      </div>
      )}
    </div>
  </>
  );
}

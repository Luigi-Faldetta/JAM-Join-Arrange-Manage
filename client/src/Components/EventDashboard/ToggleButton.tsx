import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useJoinActivityMutation,
  useLeaveActivityMutation,
} from "../../services/ThesisDB";
import { ColorRing } from  'react-loader-spinner'


interface ToggleButton {
  isJoined: boolean;
  loggedUser: string | null;
  setIsJoined: (isJoined: boolean) => void;
  isLoading: boolean;
}

export default function ToggleButton({
  isJoined,
  loggedUser,
  setIsJoined,
  isLoading,
}: ToggleButton) {
  const { eventid } = useParams();
  const navigate = useNavigate()
  const [joinActivity] = useJoinActivityMutation();
  const [leaveActivity] = useLeaveActivityMutation();
  const eventId = eventid;

  const handleJoin = () => {
    onJoin(loggedUser as string, eventId as string).then(() =>
      setIsJoined(true)
    );
  };

  const onJoin = async (userId: string, eventId: string) => {
    try {
      await joinActivity({ userId, eventId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeave = () => {
    onLeave(loggedUser as string, eventId as string).then(() =>
      setIsJoined(false)
    );
  };

  const onLeave = async (userId: string, eventId: string) => {
    try {
       leaveActivity({ userId, eventId }).then(() => navigate('/user-dashboard'))
    } catch (error) {
      console.error(error);
    }
  };

  // JOIN / LEAVE

  return (
      <div className="absolute bottom-0">
        <button
          onClick={isJoined ? handleLeave : handleJoin}
          className={isJoined ? "btn bg-indigo-900 text-pink-500 m-10 hover:bg-indigo-950":"btn bg-pink-500 text-white  m-10 font-bold hover:bg-pink-700"}
        >
          {isLoading ? (
            <ColorRing
              visible={true}
              height="100%"
              width="100%"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : isJoined ? (
            "Leave Event"
          ) : (
            "Join Event"
          )}
        </button>
      </div>
  );
}

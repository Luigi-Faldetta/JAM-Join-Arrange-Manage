import React, { useState } from "react";
import Todos from "./Todos";
import Expenses from "./Expenses";
import Attendees from "./Attendees";
import { useParams } from "react-router-dom";
import { useJoinActivityMutation, useLeaveActivityMutation } from "../../services/ThesisDB";

export default function ToggleButton() {
  const [showTodos, setShowTodos] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const { eventid } = useParams();
  const [joinActivity] = useJoinActivityMutation();
  const [leaveActivity] = useLeaveActivityMutation();
  const userId = localStorage.getItem("token");
  const eventId = eventid;

  const handleToggle = () => {
    setShowTodos((prevShowTodos) => !prevShowTodos);
  };

  const handleJoin = () => {
    onJoin(userId as string, eventId as string).then(() => setIsJoined(true));
  };

  const onJoin = async (userId: string, eventId: string) => {
    try {
      const res = await joinActivity({ userId, eventId });
      console.log("joiningggg", res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeave = () => {
    onLeave(userId as string, eventId as string).then(() => setIsJoined(false))
  };
  const onLeave = async (userId: string, eventId: string) => {
    try {
      const res = await leaveActivity({ userId, eventId });
      console.log("leavingg", res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={isJoined ? handleLeave : handleJoin}
          className="btn btn-secondary m-10"
        >
          {isJoined ? "Leave" : "Join"}
        </button>
      </div>
    </div>
  );
}

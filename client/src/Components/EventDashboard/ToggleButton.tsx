import React, { useEffect, useMemo, useState } from "react";

import { useParams } from "react-router-dom";
import {
  useJoinActivityMutation,
  useLeaveActivityMutation,
} from "../../services/ThesisDB";

export default function ToggleButton({ data }: any) {
  const userId = localStorage.getItem("token");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const { eventid } = useParams();
  const [joinActivity] = useJoinActivityMutation();
  const [leaveActivity] = useLeaveActivityMutation();
  const eventId = eventid;

  useEffect(() => {
    if (!data || !data?.data || !data?.data?.UserEvents.length) {
      setIsJoined(false);
      return;
    }

    const isJoinedCheck = data.data.UserEvents.reduce((acc: any, cur: any) => {
      if (cur.userId === userId) {
        return true;
      }
    }, false);

    if (isJoinedCheck !== isJoined) {
      setIsJoined(isJoinedCheck);
    }
  }, [data, setIsJoined]);

  //JOIN / LEAVE
  const handleJoin = () => {
    onJoin(userId as string, eventId as string).then(() => setIsJoined(true));
  };

  const onJoin = async (userId: string, eventId: string) => {
    try {
      const res = await joinActivity({ userId, eventId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeave = () => {
    onLeave(userId as string, eventId as string).then(() => setIsJoined(false));
  };
  const onLeave = async (userId: string, eventId: string) => {
    try {
      const res = await leaveActivity({ userId, eventId });
    } catch (error) {
      console.error(error);
    }
  };

  // JOIN / LEAVE

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={isJoined ? handleLeave : handleJoin}
          className="btn btn-primary m-10"
        >
          {isJoined ? "Leave" : "Join"}
        </button>
      </div>
    </div>
  );
}

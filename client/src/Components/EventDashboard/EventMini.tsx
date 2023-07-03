import React, { useEffect, useState } from "react";
import DeleteEventButton from "../Event/DeleteEvent";
import { ApiResponse } from "../../services/ApiResponseType";
import { EventState } from "../../reduxFiles/slices/events";
import moment from "moment";

export default function EventMini({
  eventData,
}: {
  eventData: ApiResponse<EventState>;
}) {
  const loggedUser = localStorage.getItem("token");

  const [userIsHost, setUserIsHost] = useState(false);

  useEffect(() => {
    console.log("Data recieved in event mini ==> ", eventData);

    const hostUser = eventData?.data.UserEvents.find(
      (user) => user.userId === loggedUser
    );

    setUserIsHost(hostUser?.userId === loggedUser ? true : false);

    console.log("hostuser", hostUser);
  }, [eventData]);

  return (
    <div className="absolute left-20 top-24 grid grid-cols-2 grid-rows-3">
      {eventData && (
        <>
          <h3 className="text-2xl col-span-2">{eventData.data.title}</h3>
          <h4 className="text-lg row-span-1 mt-2">
            🗓️ {moment(eventData.data.date).format("ddd, Do MMM - h:mm a")}
          </h4>
          <h4 className="text-lg row-span-1 col-span-1 mt-2">
            📍 {eventData.data.location}
          </h4>
          {/* <h4 className="text-lg row-span-2 mt-2">{eventData.description}</h4> */}
          <div>
            {userIsHost ? (
              <DeleteEventButton></DeleteEventButton>
            ) : (
              <h2>not host</h2>
            )}
            {/* {eventData ? (eventData.data.UserEvents.map((user)=>{
              if (user.userID === userToken && user.isHost === true ) return 
            })   : ( */}
            {/* <h2> SOMETHING </h2> */}
            {/* )} */}
            {/* DELETE BUTTON FROM THE ELSE, ONLY NEEDED SINCE WE DONT HAVE USER TOKEN YET */}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import DeleteEventButton from "../Event/DeleteEvent";
import { ApiResponse } from "../../services/ApiResponseType";
import { EventState } from "../../reduxFiles/slices/events";
import moment from "moment";
import "../Event/EventDashboard.css"
import EventLink from "./EventLink";
import { useParams } from "react-router-dom";
import { PiNotePencilBold } from 'react-icons/pi'
import { RiDeleteBinLine } from 'react-icons/ri'
import ToggleButton from "./ToggleButton";

export default function EventMini({
  eventData,
  userIsHost,
}: {
  eventData: ApiResponse<EventState>;
  userIsHost: boolean;
}) {

  // const [showTodos, setShowTodos] = useState<boolean>(true);
  const { eventid } = useParams();

  // const handleToggle = () => {
  //   setShowTodos((prevShowTodos) => !prevShowTodos);
  // };


  return (
    <div>
      {eventData && (
        <>
          <div className="flex justify-between gap-2 mt-4">

            <div id="event-data-left">

              <div className="event-img">
                <img src={eventData.data.coverPic} alt="Event picture"></img>
              </div>

              <div className="event-info">
                <h3 className="text-2xl">
                  {eventData.data.title}
                </h3>

                <h4 className="text-lg">
                  {moment(eventData.data.date).format("ddd, Do MMM - h:mm a")}
                </h4>

                <h4 className="text-lg">
                  {eventData.data.location}
                </h4>

                <h4 className="text-lg">description description description description description description description description description description</h4>


              </div>


            </div>

            <div id="event-data-right">

              <div className="event-icons">
                <RiDeleteBinLine size={30} />
                <PiNotePencilBold size={30} />
                <EventLink eventid={eventid} />
              </div>


              {/* {userIsHost ? (<DeleteEventButton></DeleteEventButton> ) : (
                <h2>not host</h2>
              )}
              {eventData ? (eventData.data.UserEvents.map((user)=>{
              if (user.userID === userToken && user.isHost === true ) return 
            })   : (
              <h2> SOMETHING </h2>
              )}
              // DELETE BUTTON FROM THE ELSE, ONLY NEEDED SINCE WE DONT HAVE USER TOKEN YET */}
{/*              
              <button              
              onClick={handleToggle}
                className="btn btn-primary"
              >
                {showTodos ? "Expenses" : "Todos"}
              </button>
               */}
            </div>



          </div>

        </>
      )}
    </div>
  );
}

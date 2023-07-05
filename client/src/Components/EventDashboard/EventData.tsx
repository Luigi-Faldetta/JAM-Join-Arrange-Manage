import React, { useEffect, useState } from "react";
import DeleteEventButton from "../Event/DeleteEvent";
import { ApiResponse } from "../../services/ApiResponseType";
import { EventState } from "../../reduxFiles/slices/events";
import moment from "moment";
import "../Event/EventDashboard.css";
import EventLink from "./EventLink";
import { useParams } from "react-router-dom";
import { PiNotePencilBold } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import ToggleButton from "./ToggleButton";
import { FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default function EventMini({
  eventData,
  userIsHost,
  showTodos,
  setShowTodos,
}: {
  eventData: ApiResponse<EventState>;
  userIsHost: boolean;
  showTodos: boolean;
  setShowTodos: any;
}) {
  const { eventid } = useParams();

  const handleToggle = () => {
    //@ts-ignore
    setShowTodos((prevShowTodos) => !prevShowTodos);
  };

  return (
    <div>
      {eventData && (
        <>
          <div className="flex h-38 justify-between gap-2 mt-6">
            <div className="flex w-3/5 h-36 gap-3">
              <div className="flex shrink-0 grow-0 w-48 h-36 bg-slate-400 border-4 border-pink-500 rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    eventData.data.coverPic
                      ? eventData.data.coverPic
                      : "https://cdn1.vectorstock.com/i/1000x1000/42/60/meeting-people-icon-simple-style-vector-22764260.jpg"
                  }
                  alt="Event picture"
                ></img>
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-bold">{eventData.data.title}</h3>

                <div className="flex items-center">
                  <FaCalendarAlt className="fill-gray-400" />
                  <h4 className="ml-1 text-lg text-gray-400">
                    {eventData.data.date
                      ? moment(eventData.data.date).format(
                          "ddd, Do MMM - h:mm a"
                        )
                      : "No date"}
                  </h4>
                </div>

                <div className="flex items-center">
                  <FaLocationDot className="fill-gray-400" />
                  <h4 className="ml-1 text-lg text-gray-400">
                    {eventData.data.location
                      ? eventData.data.location
                      : "No location"}
                  </h4>
                </div>

                <h4 className="mt-1 text-sm leading-tight">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy.
                </h4>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end w-2/5">
              <div className="flex event-icons">
                {userIsHost ? (
                  <>
                    <RiDeleteBinLine size={30} />
                    <PiNotePencilBold size={30} />
                  </>
                ) : (
                  ""
                )}
                <EventLink eventid={eventid} />
              </div>

              {/* {eventData ? (eventData.data.UserEvents.map((user)=>{
              if (user.userID === userToken && user.isHost === true ) return 
            })   : (
              <h2> SOMETHING </h2>
              )} */}

              <button
                onClick={handleToggle}
                id="exp-todo"
                className="btn bg-pink-500 hover:bg-pink-700 text-white"
              >
                {showTodos ? "Expenses" : "Todos"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

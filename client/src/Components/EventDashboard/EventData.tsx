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
  isJoined,
  loggedUser,
  setIsJoined,
  isLoading,
}: {
  eventData: ApiResponse<EventState>;
  userIsHost: boolean;
  showTodos: boolean;
  setShowTodos: any;
  isJoined: boolean;
  loggedUser: any;
  setIsJoined: any;
  isLoading: boolean
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
          <div className="flex h-38 justify-between gap-2 mt-4">
            <div className="flex w-3/5 h-36 gap-3">
              <div className="flex shrink-0 grow-0 w-48 h-36 bg-slate-400 border-2 border-pink-500 rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={
                    eventData.data.coverPic
                      ? eventData.data.coverPic
                      : 'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688544322/friends-placeholder_ljftyb.png'
                  }
                  alt="Event picture"
                ></img>
              </div>

              <div className="flex flex-col justify-start">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold">{eventData.data.title}</h3>

                  {userIsHost ? "" : (                  
                  <ToggleButton
                    isJoined={isJoined}
                    loggedUser={loggedUser}
                    setIsJoined={setIsJoined}
                    isLoading={isLoading}
                  />)}
                </div>

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
                  {eventData.data.description}
                </h4>
              </div>



            </div>

            <div className="flex flex-col justify-between items-end w-2/5">
              <div className="flex event-icons">
                {userIsHost ? (
                  <>
                    <RiDeleteBinLine size={30} className="cursor-pointer" />
                    <PiNotePencilBold size={30} className="cursor-pointer" />
                  </>
                ) : (
                  ""
                )}
                <EventLink eventid={eventid} />
              </div>
              <button
                onClick={handleToggle}
                id="exp-todo"
                className="btn w-24 bg-pink-500 hover:bg-pink-700 text-white"
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

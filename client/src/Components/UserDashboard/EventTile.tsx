import { Link } from "react-router-dom";
import moment from "moment";
import { FaLocationDot } from "react-icons/fa6";

function EventTile({ event }: { event: any }) {
  const img = "./friends-placeholder.png";

  return (
    <>
      <Link
        to={`/event/${event.eventId}`}
        className="flex flex-row w-full p-2 my-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div className="flex flex-col w-3/5 pr-3 justify-between">
          <div>
            {event.date ? (
              <h3 className="text-pink-500 text-[13px] ">
                {moment(event.date).format("ddd, Do MMM - h:mm a")}{" "}
              </h3>
            ) : (
              <h3 className="text-pink-500 text-xs lg:text-sm">Date TBC</h3>
            )}
            {event.location ? (
              <div className="flex align-bottom pt-1">
                <FaLocationDot className="fill-gray-400 inline-block" />
                <h3 className="text-sm lg:text-sm text-gray-500 inline-block pl-1">
                  {event.location}
                </h3>
              </div>
            ) : (
              <div className="flex align-bottom pt-1">
                <FaLocationDot className="fill-gray-400 inline-block" />
                <h3 className="text-sm lg:text-sm text-gray-500 inline-block pl-1">
                  Location TBC
                </h3>
              </div>
            )}
          </div>
          <h2 className=" text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {event.title}
          </h2>
          <div className="flex flex-row">
            {event.UserEvents &&
            event.UserEvents.length &&
            event.UserEvents[0].isHost === true ? (
              <p className=" text-[10px] tracking-tight text-gray-500 dark:text-white">
                ⋆ You are hosting
              </p>
            ) : (
              <p className=" text-[10px] tracking-tight text-gray-500 dark:text-white">
                ⋆ You are a guest
              </p>
            )}
          </div>
          {/* {event.host === user.id ? <p>You are hosting</p>}*/}
          {/* {event.attendees.length > 1 ? <p>{`${event.attendees.length} going`}</p>}*/}
        </div>

        <div className=" w-[270px] h-[120px] rounded-lg overflow-hidden items-center">
          <img
            className="object-cover w-full h-full"
            src={event.coverPic ? event.coverPic : img}
          ></img>
        </div>
      </Link>
    </>
  );
}

export default EventTile;

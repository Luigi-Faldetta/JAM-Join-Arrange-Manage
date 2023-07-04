import { createEventList } from "../../reduxFiles/slices/events";
import { Link } from "react-router-dom";
import moment from "moment";

function EventTile({ event }: { event: any }) {
  const img = "./friends-placeholder.png";
  console.log(event);

  return (
    <>
      <Link
        to={`/event-dashboard/${event.eventId}`}
        className="flex flex-row w-full p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        {/* <a
          href="#"
        > */}
        <div className="flex flex-col w-3/5 pr-3 justify-between">
          <div>
            {event.date ? (
              <h3 className="text-red-500 text-xs lg:text-sm">
                {moment(event.date).format("ddd, Do MMM - h:mm a")}{" "}
              </h3>
            ) : (
              <h3 className="text-red-500 text-xs lg:text-sm">Date TBC</h3>
            )}
            {event.location ? (
              <h3 className="text-xs lg:text-sm text-gray-500">
                {event.location}
              </h3>
            ) : (
              <h3 className="text-xs lg:text-sm text-gray-500">Location TBC</h3>
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

        <div className=" w-[200px] h-[120px] rounded-lg overflow-hidden items-center">
          <img
            className="object-cover w-full h-full"
            src={event.coverPic ? event.coverPic : img}
          ></img>
        </div>
        {/* </a> */}
      </Link>
    </>
  );
}

export default EventTile;

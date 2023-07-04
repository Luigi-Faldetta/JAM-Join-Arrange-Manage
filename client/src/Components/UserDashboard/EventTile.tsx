import { createEventList } from "../../reduxFiles/slices/events";
import { Link } from "react-router-dom";
import moment from "moment";

function EventTile({ event }: { event: any }) {
  const img = "./friends-placeholder.png";

  return (
    <>
      <Link
        to={`/event-dashboard/${event.eventId}`}
        className="flex flex-row max-w-xl p-2 lg:p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        {/* <a
          href="#"
        > */}
        <div className="flex flex-col w-3/5 pr-3 justify-between">
          <div>
            {event.date ? (
              <h3 className="text-red-500 text-xs lg:text-base">
                {moment(event.date).format("ddd, Do MMM - h:mm a")}{" "}
              </h3>
            ) : (
              <h3 className="text-red-500 text-xs lg:text-base">Date TBC</h3>
            )}
            {event.location ? (
              <h3 className="text-xs lg:text-base text-gray-500">
                {event.location}
              </h3>
            ) : (
              <h3 className="text-xs lg:text-base text-gray-500">
                Location TBC
              </h3>
            )}
          </div>
          <h2 className=" text-lg md:text-2xl lg:text-[34px] font-bold tracking-tight text-gray-900 dark:text-white">
            {event.title}
          </h2>
          <div className="flex flex-row">
            {event.UserEvents[0].isHost === true ? (
              <p className=" text-[12px] md:text-sm lg:text-md tracking-tight text-gray-500 dark:text-white">
                ⋆ You are hosting
              </p>
            ) : (
              <p className=" text-[10px] lg:text-sm tracking-tight text-gray-500 dark:text-white">
                ⋆ You are a guest
              </p>
            )}
          </div>
          {/* {event.host === user.id ? <p>You are hosting</p>}*/}
          {/* {event.attendees.length > 1 ? <p>{`${event.attendees.length} going`}</p>}*/}
        </div>

        <div className=" min-w-lg w-2/5 rounded-lg overflow-hidden">
          {event.coverPic ? (
            <img
              className="object-cover w-full h-full"
              src={event.coverPic}
            ></img>
          ) : (
            <img className="object-cover w-full h-full" src={img}></img>
          )}
        </div>
        {/* </a> */}
      </Link>
    </>
  );
}

export default EventTile;

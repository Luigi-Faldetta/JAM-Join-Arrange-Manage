import { createEventList } from "../../reduxFiles/slices/events";

function EventTile(/*{event}*/) {
  const img = "./Screenshot-friends.png";
  return (
    <>
      {/* <div className="card card-side bg-base-100 shadow-xl">
        <figure>
          <img src={img} alt="Movie" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">New movie is released!</h2>
          <p>Click the button to watch on Jetflix app.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Watch</button>
          </div>
        </div>
      </div> */}

      <a
        href="#"
        className="flex flex-row max-w-xl p-2 lg:p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <div className="flex flex-col w-3/5 pr-3 justify-between">
          <div>
            <h3 className="text-pink-500 text-xs lg:text-base">
              Sat, 5th Never @ 9:00 PM{" "}
            </h3>
            <h3 className="text-xs lg:text-base text-gray-500">
              12345, Rainbow Lane
            </h3>
          </div>
          <h2 className=" text-lg lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Really cool event!!!
          </h2>
          <h2 className=" text-[10px] lg:text-sm tracking-tight text-gray-500 dark:text-white">
            👤 12 going ⋆ You are hosting
          </h2>
          {/* {event.host === user.id ? <p>You are hosting</p>}*/}
          {/* {event.attendees.length > 1 ? <p>{`${event.attendees.length} going`}</p>}*/}

          {/* <p className="font-normal text-gray-700 dark:text-gray-400">
          This will be a super fun event description!
        </p> */}
        </div>

        <div className=" min-w-lg w-2/5 rounded-lg overflow-hidden">
          <img className="object-cover w-full h-full" src={img}></img>
        </div>
      </a>
    </>
  );
}

export default EventTile;

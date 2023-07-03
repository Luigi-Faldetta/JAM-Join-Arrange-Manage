import React, { useEffect, useState } from "react";
import DeleteEventButton from "../Event/DeleteEvent";
import { ApiResponse } from "../../services/ApiResponseType";
import { EventState } from "../../reduxFiles/slices/events";
import moment from "moment";

const userToken = "test";

// interface Event {
//   coverPic: string;
//   date: string;
//   description?: string;
//   eventId: string;
//   host?: string;
//   location: string;
//   title: string;
// }

export default function EventMini({
  eventData,
}: {
  eventData: ApiResponse<EventState>;
}) {
  // const [eventDetails, setEventDetails] = useState<EventState>({
  //   coverPic: "",
  //   date: new Date(),
  //   description: "",
  //   eventId: "",
  //   host: "",
  //   location: "",
  //   title: "",
  // });

  useEffect(() => {
    console.log("Data recieved in event mini ==> ", eventData);
  }, [eventData]);

  // useEffect(() => {
  //   fetch(
  //     "https://codeworks-thesis-4063bceaa74a.herokuapp.com/event/73ad298d-0a34-415b-bd7d-cec1578cf1d4"
  //   )
  //     .then((response) => response.json())
  //     .then((fetchedEvent) => {
  //       console.log(fetchedEvent);
  //       console.log(fetchedEvent.data);
  //       setEventDetails(fetchedEvent.data);
  //       console.log(eventDetails);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching event:", error);
  //     });
  // }, []);

  return (
    <div className="absolute left-20 top-24 grid grid-cols-2 grid-rows-3 text-white">
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
            {/* {eventData.data.host === userToken ? (
              <DeleteEventButton></DeleteEventButton>
            ) : (
              <DeleteEventButton></DeleteEventButton>
            )} */}
            {/* DELETE BUTTON FROM THE ELSE, ONLY NEEDED SINCE WE DONT HAVE USER TOKEN YET */}
          </div>
        </>
      )}
    </div>
  );
}

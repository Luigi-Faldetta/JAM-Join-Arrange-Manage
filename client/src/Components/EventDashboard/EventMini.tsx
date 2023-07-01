import React, { useEffect, useState } from "react";
import DeleteEventButton from "../Event/DeleteEvent";

const userToken = "test";

interface Event {
  coverPic: string;
  date: string;
  description?: string;
  eventId: string;
  host?: string;
  location: string;
  title: string;
}

export default function EventMini() {
  const [eventDetails, setEventDetails] = useState<Event>({
    coverPic: "",
    date: "",
    description: "",
    eventId: "",
    host: "",
    location: "",
    title: "",
  });

  useEffect(() => {
    fetch(
      "https://codeworks-thesis-4063bceaa74a.herokuapp.com/event/73ad298d-0a34-415b-bd7d-cec1578cf1d4"
    )
      .then((response) => response.json())
      .then((fetchedEvent) => {
        console.log(fetchedEvent);
        console.log(fetchedEvent.data);
        setEventDetails(fetchedEvent.data);
        console.log(eventDetails);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, []);

  return (
    <div className="absolute left-20 top-24 grid grid-cols-2 grid-rows-3 text-white">
      {eventDetails && (
        <>
          <h3 className="text-2xl col-span-2">{eventDetails.title}</h3>
          <h4 className="text-lg row-span-1 mt-2">🗓️ {eventDetails.date}</h4>
          <h4 className="text-lg row-span-1 col-span-1 mt-2">
            📍 {eventDetails.location}
          </h4>
          <h4 className="text-lg row-span-2 mt-2">
            {eventDetails.description}
          </h4>
          <div>
            {eventDetails.host === userToken ? (
              <DeleteEventButton></DeleteEventButton>
            ) : (
              <DeleteEventButton></DeleteEventButton>
            )}
            {/* DELETE BUTTON FROM THE ELSE, ONLY NEEDED SINCE WE DONT HAVE USER TOKEN YET */}
          </div>
        </>
      )}
    </div>
  );
}

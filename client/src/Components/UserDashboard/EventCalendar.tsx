import React, { useState } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { isSameDay } from "date-fns";
import "./calendar.css";

function EventCalendar({ sortedEventList }: { sortedEventList: any }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };
  //@ts-ignore
  const tileContent = ({ date, view }) => {
    // Check if there's an event for the current date
    const event = sortedEventList.find((event: any) =>
      isSameDay(new Date(event.date), date)
    );
    //@ts-ignore

    if (view === "month") {
      return (
        <div>
          {event && (
            <div className="align-top bg-pink-400 p-1 rounded-sm">
              {/* <div className=""> */}
              {/* <div className="event-details"> */}
              {/* Additional event details */}
              {/* </div> */}
              <div className="event-day text-[12px]">{event.title}</div>
              {/* </div> */}
            </div>
          )}
          {!event && (
            <div className="default-day text-xs align-top self-start">
              {/* <div className="default-day-number">{date.getDate()}</div> */}
            </div>
          )}
        </div>
      );
    }
    // Default tile content for other views (e.g., week, day)
    return null;
  };
  //@ts-ignore
  function tileClassName({ date, view }) {
    if (view === "month") {
      const hasEvent = sortedEventList.some((event: any) =>
        isSameDay(new Date(event.date), date)
      );
      if (hasEvent) {
        return "tile-with-event";
      }
      if (date < new Date()) {
        return "past-date";
      }
    }
  }

  return (
    <div className=" my-8">
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        tileContent={tileContent}
        className=" p-2 shadow rounded-lg"
        minDate={new Date()}
        tileClassName={tileClassName}
      />
    </div>
  );
}

export default EventCalendar;

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { isSameDay } from "date-fns";

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

    if (view === "month") {
      return (
        <div className="tile-content">
          {event && (
            <div className="event-day">
              {/* <div className="event-day-number">{date.getDate()}</div> */}
              <div className="event-details">
                <span className="event-title">{event.title}</span>
                {/* Additional event details */}
              </div>
            </div>
          )}
          {!event && (
            <div className="default-day">
              {/* <div className="default-day-number">{date.getDate()}</div> */}
            </div>
          )}
        </div>
      );
    }

    // Default tile content for other views (e.g., week, day)
    return null;
  };

  return (
    <Calendar
      value={selectedDate}
      onChange={handleDateChange}
      tileContent={tileContent}
    />
  );
}

export default EventCalendar;

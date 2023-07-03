import { useEffect, useState } from "react";
import { AiOutlineComment } from "react-icons/ai";
import { useGetEventQuery, useGetEventsQuery } from "../../services/ThesisDB";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { setEventList } from "../../reduxFiles/slices/events";
import ChatContainer from "./ChatContainer";
import { openChat, openWithEventId } from "../../reduxFiles/slices/chat";
interface Event {
  coverPic: string;
  date: string;
  description?: string;
  eventId: string;
  host?: string;
  location: string;
  title: string;
}

function Chat() {
  const [chatDropdown, setChatDropdown] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    coverPic: "",
    date: "",
    description: "",
    eventId: "",
    host: "",
    location: "",
    title: "",
  });
  const userToken = localStorage.getItem("token");
  const eventList = useSelector((state: RootState) => state.eventListReducer);
  const { data, error, isLoading } = useGetEventsQuery(userToken as string);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && !error) {
      dispatch(setEventList(data?.data));
    }
  }, [isLoading, error]);

//   useEffect(() => {
//     console.log("Event list has changed ==> ", eventList);
//   }, [eventList]);

  const handleChatClick = () => {
    setChatDropdown(!chatDropdown);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    if (event.eventId) {
      dispatch(openWithEventId(selectedEvent.eventId))
    }
    setChatDropdown(false);
  };

  return (
    <div className="flex items-center md:order-2">
      <button
        type="button"
        className=""
        id="user-menu-button"
        aria-expanded={chatDropdown ? "true" : "false"}
        onClick={handleChatClick}
        data-dropdown-toggle="user-dropdown"
        data-dropdown-placement="bottom"
      >
        <span className="sr-only">Open user menu</span>
        <AiOutlineComment className="w-8 h-8 text-black" />
      </button>
      {chatDropdown && (
        <div className="dropdown-menu">
          <ul>
            {eventList.map((event) => (
              <li
                key={event.eventId}
                onClick={() => handleEventClick(event)}
                className="event-item"
              >
                <div className="avatar-wrapper">
                  <img
                    className="avatar"
                    src={event.coverPic}
                    alt={event.title}
                  />
                </div>
                <span className="event-title">{event.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* <div className="chat">
      {selectedEvent && <ChatContainer event={selectedEvent} />} 
      </div> */}
    </div>
  );
}

export default Chat;

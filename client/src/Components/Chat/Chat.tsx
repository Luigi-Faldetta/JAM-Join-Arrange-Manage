import { useEffect, useState } from "react";
import { AiOutlineComment } from "react-icons/ai";
import { useGetEventQuery, useGetEventsQuery } from "../../services/ThesisDB";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { setEventList } from "../../reduxFiles/slices/events";
import ChatContainer from "./ChatContainer";
import { openChat, openWithEventId } from "../../reduxFiles/slices/chat";
import { useClickAway } from "@uidotdev/usehooks";
import "./chatContainer.css";
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
  const ref = useClickAway(() => {
    setChatDropdown(false)
  })
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && !error) {
      dispatch(setEventList(data?.data));
    }
  }, [isLoading, error]);


  const handleChatClick = () => {
    setChatDropdown(!chatDropdown);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
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
  <div className="dropdown-menu" ref={ref}>
    <ul>
      {eventList.length ? (
        eventList.map((event) => (
          <li
            key={event.eventId}
            onClick={() => handleEventClick(event)}
            className="event-item"
          >
            <div className="avatar-wrapper">
              <img className="avatar" src={event.coverPic} alt={event.title} />
            </div>
            <span className="event-title">{event.title}</span>
          </li>
        ))
      ) : (
        <div>No chats available at the moment.</div>
      )}
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

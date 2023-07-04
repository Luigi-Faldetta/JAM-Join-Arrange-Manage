import { useEffect, useState } from "react";
import { AiOutlineComment } from "react-icons/ai";
import { socket, useGetEventQuery, useGetEventsQuery } from "../../services/ThesisDB";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { setEventList } from "../../reduxFiles/slices/events";
import ChatContainer from "./ChatContainer";
import { openChat, openWithEventId } from "../../reduxFiles/slices/chat";
import { useClickAway } from "@uidotdev/usehooks";
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
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
  //   useEffect(() => {
    //     console.log("Event list has changed ==> ", eventList);
    //   }, [eventList]);
    
    const handleChatClick = () => {
      setChatDropdown(!chatDropdown);
    };
    
    const handleEventClick = (event: any) => {
      setSelectedEvent(event);
    if (event.eventId) {
      // console.log("Event id se in the chat ==> ",event.eventId)
      dispatch(openWithEventId(event.eventId))
      socket.emit("joinRoom", { userId: localStorage.getItem('token') || "", eventId: event.eventId });
    }
    setChatDropdown(false);
  };

  return (
    <div className="flex items-center">
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
        <HiOutlineChatBubbleLeftRight id="chat-icon"  className="w-8 h-8 md:hover:text-pink-500"/>
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

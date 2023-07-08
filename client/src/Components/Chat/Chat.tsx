import { useEffect, useState } from "react";
import {
  socket,
  useGetEventsQuery,
} from "../../services/ThesisDB";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { setEventList } from "../../reduxFiles/slices/events";
import { openWithEventId } from "../../reduxFiles/slices/chat";
import { useClickAway } from "@uidotdev/usehooks";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import "./chatContainer.css";


function Chat() {
  const [chatDropdown, setChatDropdown] = useState(false);
  const userToken = localStorage.getItem("token");
  const eventList = useSelector((state: RootState) => state.eventListReducer);
  const { data, error, isLoading } = useGetEventsQuery(userToken as string);
  const ref = useClickAway(() => {
    setChatDropdown(false);
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading && !error) {
      dispatch(setEventList(data?.data));
    }
  }, [isLoading, error]);

  const handleChatClick = () => {
    setChatDropdown(!chatDropdown);
  };

  const handleEventClick = (eventId: string) => {
    if (eventId) {
      dispatch(openWithEventId(eventId));
      socket.emit("joinRoom", {
        userId: localStorage.getItem("token") || "",
        eventId: eventId,
      });
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
        <HiOutlineChatBubbleLeftRight
          id="chat-icon"
          className="w-8 h-8 md:hover:text-pink-500 stroke-black"
        />
      </button>
      {chatDropdown && (
        <div className="dropdown-menu" ref={ref}>
          <ul>
            {eventList.length ? (
              eventList.map((event) => (
                <li
                  key={event.eventId}
                  onClick={() => handleEventClick(event.eventId as string)}
                  className="event-item"
                >
                  <div className="avatar-wrapper flex overflow-hidden border border-slate-300">
                    <img
                      className="avatar w-full h-full object-cover"
                      src={event.coverPic? event.coverPic : 'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688544322/friends-placeholder_ljftyb.png'
                    }
                      alt={event.title}
                    />
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
    </div>
  );
}

export default Chat;

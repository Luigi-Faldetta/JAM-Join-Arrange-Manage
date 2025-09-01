import { useEffect, useState } from 'react';
import { socket, useGetEventsQuery, useGetMeQuery } from '../../services/JamDB';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../reduxFiles/store';
import { setEventList } from '../../reduxFiles/slices/events';
import { openWithEventId } from '../../reduxFiles/slices/chat';
import { useClickAway } from '@uidotdev/usehooks';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import './chatContainer.css';

function Chat() {
  const [chatDropdown, setChatDropdown] = useState(false);
  const userToken = localStorage.getItem('token');
  const { data: userData } = useGetMeQuery();
  const userId = userData?.data?.userId;
  const eventList = useSelector((state: RootState) => state.eventListReducer);
  const { data, error, isLoading } = useGetEventsQuery(userId || '', {
    skip: !userToken || !userId,
  });
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
      if (socket) {
        socket.emit('joinRoom', {
          userId: localStorage.getItem('token') || '',
          eventId: eventId,
        });
      }
    }
    setChatDropdown(false);
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        className="p-2.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        id="user-menu-button"
        aria-expanded={chatDropdown ? 'true' : 'false'}
        onClick={handleChatClick}
        data-dropdown-toggle="user-dropdown"
        data-dropdown-placement="bottom"
      >
        <span className="sr-only">Open chat menu</span>
        <HiOutlineChatBubbleLeftRight
          id="chat-icon"
          className="w-5 h-5 text-white"
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
                  <div className="avatar-wrapper">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        event.coverPic
                          ? event.coverPic
                          : 'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688544322/friends-placeholder_ljftyb.png'
                      }
                      alt={event.title}
                    />
                  </div>
                  <span className="event-title">{event.title}</span>
                </li>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-sm">No chats available at the moment.</div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Chat;

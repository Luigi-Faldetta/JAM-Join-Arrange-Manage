import { useEffect, useRef, useState } from "react";
import { closeChat } from "../../reduxFiles/slices/chat";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { useAuth } from "../../utils/useAuth";
import "./chatContainer.css";
import { useSelector } from "react-redux";
import {
  socket,
  useAddMsgMutation,
  useGetEventQuery,
  useGetMsgsQuery,
} from "../../services/JamDB";
import moment from "moment";
import { MsgState, addMessage, setMessages } from "../../reduxFiles/slices/msg";
import { ColorRing } from "react-loader-spinner";
import Msg from "./Msg";
import { VscSend } from "react-icons/vsc"

function ChatContainer() {
  const [addNewMsg] = useAddMsgMutation();
  const { eventId } = useSelector((state: RootState) => state.chatReducer);
  const messages = useSelector((state: RootState) => state.msgListReducer);
  const dispatch = useAppDispatch();
  useAuth();
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("token");


  const { data: dataevent } = useGetEventQuery(eventId as string);

  const {
    data: _data,
    isSuccess,
    refetch,
    isLoading,
  } = useGetMsgsQuery(eventId as string);
  const data = _data?.data;
  const handleMessageSubmit = async (message: string) => {
    try {
      socket.emit("newMessage", { userId, eventId, message });

      if (isSuccess) {
        refetch();
      }

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket.on("newMessage", (res: any) => {
      dispatch(addMessage(res.data));
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        messagesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    });
  }, [socket]);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleMessageSubmit(message);
    setMessage('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleMessageSubmit(message);
      setMessage('')
    }
  };

  useEffect(() => {
    if (data && !isLoading) {
      dispatch(setMessages(data));
      if (messagesRef.current) {
        messagesRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  }, [data, isLoading]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="chat-container border-2 border-indigo-900 md:rounded-xl">
        <div className="chat-header">
          <div className="chat-title w-full text-base text-center text-black">{dataevent?.data.title}</div>
          <div className="close absolute right-4" onClick={() => dispatch(closeChat())}>
            ×
          </div>
        </div>
        <div className="chat-messages">
          {isLoading ? (
            <ColorRing
              visible={true}
              height="50%"
              width="100%"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#ec4899", "#ec4899", "#ec4899", "#ec4899", "#ec4899"]}
            />
          ) : (
            isSuccess && (
              <Msg messages={messages} userId={userId} messagesRef={messagesRef} />
            )
          )}
        </div>
        <div className="input-container">
          <input
            className="bg-white border-slate-300 md:active:border-pink-500 md:focus:border-pink-500 w-5/6 py-4 px-3 rounded-xl xl-2 pr-2"
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            name="message"
            autoComplete="off" // Disable autocomplete
            autoCapitalize="off" // Disable autocapitalize
          />
          <VscSend className="absolute right-8 h-6 w-6 fill-pink-500" onClick={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

export default ChatContainer;

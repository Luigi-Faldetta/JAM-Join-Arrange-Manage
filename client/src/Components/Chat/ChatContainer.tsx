import { useEffect, useRef, useState } from "react";
import { closeChat } from "../../reduxFiles/slices/chat";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { useAuth } from "../../utils/useAuth";
import "./chatContainer.css";
import { useSelector } from "react-redux";
import { useAddMsgMutation, useGetMsgsQuery } from "../../services/ThesisDB";
import moment from "moment";
import { MsgState } from "../../reduxFiles/slices/msg";

function ChatContainer() {
  const [addNewMsg] = useAddMsgMutation();
  const chatState = useSelector((state: RootState) => state.chatReducer);
  const dispatch = useAppDispatch();
  useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MsgState[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("token");
  const eventId = chatState.eventId;
  const query = useGetMsgsQuery(eventId as string);
  const data = query.data?.data;
  const handleMessageSubmit = async (message: string) => {
    // console.log("event Id from chat comp ==> ", chatState.eventId);
    // console.log("user:", userId, "eventId;", eventId, message);

    try {
      const res = await addNewMsg({ userId: userId || "", eventId, message });
      if (query.isSuccess) {
        query.refetch();
      }
      setMessage("");
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    } catch (error) {
      console.error(error);
    }
    setMessage("");
    // if (message) {
    //   setMessages((prevMessages) => [...prevMessages, message]);
    //   setMessage("");
    // }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log('here')
      event.preventDefault();
      handleMessageSubmit(message);
    }
  };
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="chat-container">
      <div
        className="border rounded-lg h-full"
        style={{backgroundColor: "#F8F8FF", borderColor: "#D3D3D3" }}
      >
        <div className="flex flex-col mt-2 chat-messages">
          <div className="px-5 flex flex-col justify-between">
            <div className="flex flex-col mt-5">
              <div className="close" onClick={() => dispatch(closeChat())}>
                ×
              </div>
              <div className="flex justify-end mb-4">
                  {/* Welcome to the group everyone! */}
              <div className="message-container" ref={messagesRef}>
              {query.isSuccess && data?.map((messageData: any) => (
  <div key={messageData.id} className="relative ml-8 text-sm bg-blue-400  py-2 px-4 shadow rounded-xl m-1">
    <div className="message">{messageData.message}</div>
    <div className="time">{moment(messageData.date).calendar()}{" "}</div>
  </div>
))}
            </div>
                <img
                  src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                  className="object-cover h-8 w-8 rounded-full"
                  alt=""
                />
              </div>
              {/* <div className="flex justify-start mb-4">
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          /> */}
              {/* </div> */}
            </div>
            </div>
        </div>
            <div className="input-container">
              <input
                className="flex w-full bg-gray-300 py-3 px-3 rounded-xl xl-2 pr-2 mb-0"
                type="text"
                placeholder="Type your message here..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                name="message"
              />
          </div>
      </div>
    </div>
  );
}

export default ChatContainer;

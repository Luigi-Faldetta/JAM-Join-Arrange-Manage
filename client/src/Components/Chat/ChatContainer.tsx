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
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleMessageSubmit(message);
    }
  };

  useEffect(() => {
    if (data) {
      setMessages(data);
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }
  }, [data]);

  return (
    <div className="chat-container">
      
      <div
        className="border rounded-lg h-full"
        style={{ backgroundColor: "#F8F8FF", borderColor: "#D3D3D3" }}
      >
        <div className="chat-messages" style={{ width: '100%' }}>
          <div className="px-5 flex flex-col justify-between">
            <div className="flex flex-col mt-5">
              <div className="close" onClick={() => dispatch(closeChat())}>
                ×
              </div>
              <div className="flex justify-end mb-4" ref={messagesRef}>
                <div className="message-container">
                  {query.isSuccess &&
                    data?.map((messageData: any, index) => {
                      const isCurrentUser = messageData.userId === userId;
                      // console.log(messageData.User.profilePic)
                      const messageClassName = `relative text-xs py-2 px-4 shadow rounded-xl m-2 w-80 ${
                        isCurrentUser ? "bg-blue-400 ml-8" : "bg-gray-300 mr-8"
                      }`;

                      return (
                        <div key={messageData.id} className={messageClassName}>
                          <div className="user">
                          <img
                            src={messageData.User.profilePic}
                            className="object-cover h-8 w-8 rounded-full"
                            alt=""
                          />
                          <div className="p-2">{messageData.User.name}</div>
                          </div>
                          {/* <div>{messageData.User.profilePic}</div> */}
                          <div className="message ">{messageData.message}</div>
                          <div className="time">
                            {moment(messageData.date).calendar()}{" "}
                          </div>
                        </div>
                      );
                    })}
                </div>
                {/* <img
                  src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                  className="object-cover h-8 w-8 rounded-full"
                  alt=""
                /> */}
              </div>
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

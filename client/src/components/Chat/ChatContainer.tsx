import { useEffect, useRef, useState } from "react";
import { closeChat } from "../../reduxFiles/slices/chat";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { useAuth } from "../../utils/useAuth";
import "./chatContainer.css";
import { useSelector } from "react-redux";
import { useClickAway } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import {
  socket,
  useAddMsgMutation,
  useGetEventQuery,
  useGetMsgsQuery,
  useGetMeQuery,
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
  const { data: userData } = useGetMeQuery();
  const userId = userData?.data?.userId;
  
  const chatContainerRef = useClickAway(() => {
    dispatch(closeChat());
  });


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
      if (socket && userId) {
        socket.emit("newMessage", { userId, eventId, message });
      }

      if (isSuccess) {
        refetch();
      }

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (res: any) => {
        dispatch(addMessage(res.data));
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
          messagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      };

      socket.on("newMessage", handleNewMessage);
      
      return () => {
        if (socket) {
          socket.off("newMessage", handleNewMessage);
        }
      };
    }
  }, [socket, dispatch]);
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
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-4 right-4 z-40"
    >
      <form onSubmit={handleSubmit}>
        <div 
          className="w-80 h-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-transparent bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #8b5cf6, #ec4899, #8b5cf6) border-box'
          }}
          ref={chatContainerRef}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
              {dataevent?.data.title}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(closeChat())}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 text-2xl font-light"
              type="button"
            >
              ×
            </motion.button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white/50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <ColorRing
                  visible={true}
                  height="60"
                  width="60"
                  ariaLabel="loading-messages"
                  wrapperStyle={{}}
                  wrapperClass=""
                  colors={["#8b5cf6", "#a855f7", "#c084fc", "#ec4899", "#f472b6"]}
                />
              </div>
            ) : (
              isSuccess && (
                <Msg messages={messages} userId={userId || null} messagesRef={messagesRef} />
              )
            )}
          </div>
          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white/80">
            <div className="relative flex items-center">
              <input
                className="flex-1 py-3 px-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 bg-white/90 text-gray-800 placeholder-gray-500 transition-all duration-200"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                name="message"
                autoComplete="off"
                autoCapitalize="off"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="absolute right-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                <VscSend className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

export default ChatContainer;

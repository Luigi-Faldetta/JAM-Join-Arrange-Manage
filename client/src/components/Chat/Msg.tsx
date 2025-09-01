import moment from "moment";
import { useEffect } from "react";
import { MsgState } from "../../reduxFiles/slices/msg";
import { motion } from "framer-motion";

interface MsgProps {
  messages: MsgState[];
  userId: string | null;
  messagesRef: any;
}

const Msg = ({ messages, userId, messagesRef }: MsgProps) => {

 useEffect(() => {
  if (messagesRef.current) {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    messagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
 }, [messages, messagesRef.current]);

  const sortedMessages = [...messages].sort((a: MsgState, b: MsgState) =>
    moment(a.date).diff(moment(b.date))
  );

  return (
    <>
      {sortedMessages &&
        sortedMessages.map((messageData: MsgState, i: number) => {
          // Add safety check for messageData
          if (!messageData || !messageData.message) {
            return null;
          }
          
          const isCurrentUser = messageData.userId && userId && messageData.userId === userId;

          return (
            <motion.div
              key={messageData.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
              ref={messages.length === i + 1 ? messagesRef : undefined}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                isCurrentUser
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white ml-4"
                  : "bg-white border border-gray-200 text-gray-800 mr-4"
              }`}>
                {!isCurrentUser && (
                  <div className="flex items-center space-x-2 mb-2">
                    {messageData.User && messageData.User.profilePic && (
                      <img
                        src={messageData.User.profilePic}
                        className="object-cover h-6 w-6 rounded-full"
                        alt=""
                      />
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {messageData.User?.name || 'Anonymous'}
                    </span>
                  </div>
                )}

                <div className={`text-sm leading-relaxed ${
                  isCurrentUser ? 'text-white' : 'text-gray-800'
                }`}>
                  {messageData.message}
                </div>
                
                <div className={`text-xs mt-2 ${
                  isCurrentUser 
                    ? 'text-purple-100 text-right' 
                    : 'text-gray-500 text-right'
                }`}>
                  {moment(messageData.date).calendar()}
                </div>
              </div>
            </motion.div>
          );
        })}
    </>
  );
};

 export default Msg;
import moment from "moment";
import { useState, useEffect } from "react";

const Msg = ({ messages, userId, messagesRef }: any) => {
  const [len, setLen] = useState(messages.length)
  // const len = messages.length;
 useEffect(() => {
  if(messages.length !== len) {
    setLen(messages.length)
    console.log(messagesRef)
  }
  if (messagesRef.current) {
    // messagesRef.current.scrollIntoView({ behavior: 'smooth' })
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    messagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
 },)

  const sortedMessages = [...messages].sort((a: any, b: any) =>
    moment(a.date).diff(moment(b.date))
  );

  return (
    <>
      {sortedMessages &&
        sortedMessages.length &&
        sortedMessages.map((messageData: any, i: number) => {
          const isCurrentUser = messageData.userId === userId;

          const messageClassName = `relative text-m p-1 px-2 shadow rounded-xl m-1 ${
            isCurrentUser
              ? "bg-pink-300 border-2 border-pink-500 ml-12"
              : "bg-indigo-700 border-2 border-indigo-900 mr-12 text-white"
          } inline-block`;

          const dateClassName = `${
            isCurrentUser
              ? "flex justify-end text-slate-600 text-xs"
              : "flex justify-end text-slate-400 text-xs"
          }`;

          return (
            <div
              key={messageData.id}
              className={messageClassName}
              ref={len === i + 1 ? messagesRef : undefined}
            >
              {!isCurrentUser && (
                <div className="user">
                  {messageData.User && messageData.User.profilePic && (
                    <img
                      src={messageData.User.profilePic}
                      className="object-cover h-8 w-8 rounded-full"
                      alt=""
                    />
                  )}
                  <div className="p-2">{messageData.User.name}</div>
                </div>
              )}

              <div className="message">{messageData.message}</div>
              <div className={dateClassName}>
                {moment(messageData.date).calendar()}
              </div>
            </div>
          );
        })}
    </>
  );
};

 export default Msg;
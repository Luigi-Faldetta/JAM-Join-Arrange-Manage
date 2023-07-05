import moment from "moment";

const Msg = ({messages, userId}: any) => {

    if (!messages) {
      return "";
    }
    return messages?.map((messageData: any) => {
        const isCurrentUser = messageData.userId === userId;
      
        const messageClassName = `relative text-m p-2 px-4 shadow rounded-xl m-1 ${
            isCurrentUser ? "bg-pink-400 ml-12" : "bg-indigo-800 mr-12 text-white"
          } inline-block`;

        const dateClassName = `${isCurrentUser ? "flex justify-end text-slate-600 text-xs" : "flex justify-end text-slate-400 text-xs"
          }`;
      

        return (
          <div key={messageData.id} className={messageClassName}>
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
      });
      
  }
  export default Msg
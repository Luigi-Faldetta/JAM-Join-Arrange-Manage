import moment from "moment";

const Msg = ({messages, userId}: any) => {

    if (!messages) {
      return "";
    }
    return messages?.map((messageData: any) => {
        const isCurrentUser = messageData.userId === userId;
      
        const messageClassName = `relative text-m py-2 px-4 shadow rounded-xl m-2 ${
            isCurrentUser ? "bg-blue-400 ml-8" : "bg-gray-300 mr-8"
          } inline-block`;
      
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
            <div className="time text-xs">
              {moment(messageData.date).calendar()}
            </div>
          </div>
        );
      });
      
  }
  export default Msg
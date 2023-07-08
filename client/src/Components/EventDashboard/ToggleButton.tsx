import { useNavigate, useParams } from "react-router-dom";
import {
  useGetEventQuery,
  useGetUserQuery,
  useJoinActivityMutation,
  useLeaveActivityMutation,
} from "../../services/ThesisDB";
import { ColorRing } from  'react-loader-spinner'
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { UserState, deleteUserFromList, updateUserList } from "../../reduxFiles/slices/users";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { EventState, addEventToList, deleteEventFromList } from "../../reduxFiles/slices/events";
import { closeChat } from "../../reduxFiles/slices/chat";



interface ToggleButton {
  isJoined: boolean;
  loggedUser: string | null;
  setIsJoined: (isJoined: boolean) => void;
  isLoading: boolean;
}

export default function ToggleButton({
  isJoined,
  loggedUser,
  setIsJoined,
  isLoading,
}: ToggleButton) {
  const { eventid } = useParams();
  const navigate = useNavigate()
  const [joinActivity] = useJoinActivityMutation();
  const [leaveActivity] = useLeaveActivityMutation();
  const eventId = eventid as string;
  const appDispatch = useAppDispatch()
  const token = localStorage.getItem("token") as string
  const {data} = useGetUserQuery(token)
  const eventData = useGetEventQuery(eventId);
  const chatInfo = useSelector((state:RootState) => state.chatReducer)

  const handleJoin = () => {
    onJoin(loggedUser as string, eventId as string).then(() =>
      setIsJoined(true)
    )
    appDispatch(updateUserList(data?.data as UserState))
    appDispatch(addEventToList(eventData.data?.data as EventState))
  };

  const onJoin = async (userId: string, eventId: string) => {
    try {
      await joinActivity({ userId, eventId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeave = () => {
    appDispatch(deleteUserFromList(token));
    appDispatch(deleteEventFromList(eventId));
    if(eventId === chatInfo.eventId)  appDispatch(closeChat());
    onLeave(loggedUser as string, eventId as string).then(() =>
      setIsJoined(false)
    );
  };

  const onLeave = async (userId: string, eventId: string) => {
    try {
       await leaveActivity({ userId, eventId })
       navigate('/user-dashboard')
    } catch (error) {
      console.error(error);
    }
  };

  // JOIN / LEAVE

  return (
      <div className="">
        <button
          onClick={isJoined ? handleLeave : handleJoin}
          className="btn flex bg-white items-center gap-2 px-4 ml-4 border-2 border-slate-200 rounded-md text-black hover:bg-gray-100 hover:border-slate-100"
        >
          {isLoading ? (
            <ColorRing
              visible={true}
              height="100%"
              width="100%"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : isJoined ? (
            <>
            LEAVE
            <FaArrowRight size={16} className="fill-gray-400"/>
            </>
          ) : (
            <>
            <FaArrowLeft size={16} className="fill-pink-400"/>
            JOIN
            </>
          )}
        </button>

      </div>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserQuery,
  useJoinActivityMutation,
  useLeaveActivityMutation,
} from "../../services/ThesisDB";
import { ColorRing } from  'react-loader-spinner'
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../reduxFiles/store";
import { UserState, deleteUserFromList, updateUserList } from "../../reduxFiles/slices/users";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"



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
  const eventId = eventid;
  // const attendees = useSelector((state:RootState) => state.userList)
  const appDispatch = useAppDispatch()
  const token = localStorage.getItem("token") as string
  const {data} = useGetUserQuery(token)

  const handleJoin = () => {
    onJoin(loggedUser as string, eventId as string).then(() =>
      setIsJoined(true)
    );
    appDispatch(updateUserList(data?.data as UserState))
  };

  const onJoin = async (userId: string, eventId: string) => {
    try {
      await joinActivity({ userId, eventId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeave = () => {
    onLeave(loggedUser as string, eventId as string).then(() =>
      setIsJoined(false)
    );
    appDispatch(deleteUserFromList(token))
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
          className="btn flex bg-white items-center gap-2 px-4 ml-4 border-2 border-slate-200 rounded-md"
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
            <FaArrowRight size={16} className="fill-gray-300"/>
            </>
          ) : (
            <>
            <FaArrowLeft size={16} className="fill-pink-300"/>
            JOIN
            </>
          )}
        </button>

      </div>
  );
}

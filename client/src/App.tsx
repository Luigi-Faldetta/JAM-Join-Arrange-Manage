import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./reduxFiles/store";
import Logout from "./components/Logout";
import ChatContainer from "./components/Chat/ChatContainer";

function App() {
  const logoutState = useSelector((state: RootState) =>
    state.logoutReducer.valueOf()
  );
  const chatState = useSelector((state: RootState) =>
    state.chatReducer.valueOf()
  ) as { isOpen: boolean; eventId: string };


  return (
    <>
      <div className="App bg-white">
        <Navbar />
        {logoutState ? <Logout /> : null}
        {chatState.isOpen ? <ChatContainer /> : null}
        <Outlet />
      </div>
    </>
  );
}

export default App;

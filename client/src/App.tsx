import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./reduxFiles/store";
import Logout from "./Components/Logout";
import { useEffect, useState } from "react";
import ChatContainer from "./Components/Chat/ChatContainer";

function App() {
  const logoutState = useSelector((state: RootState) =>
    state.logoutReducer.valueOf()
  );
  const chatState = useSelector((state: RootState) =>
  state.chatReducer.valueOf()
  ) as { isOpen: boolean, eventId: string};

  useEffect(() => {
    console.log("logout state ==> ", chatState);
  }, [chatState])

  return (
    <>
      <div className="App">
        <Navbar />
        {logoutState ? <Logout /> : null}
        {chatState.isOpen ? <ChatContainer /> : null}
        <Outlet />
      </div>
    </>
  );
}

export default App;

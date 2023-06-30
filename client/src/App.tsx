import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./reduxFiles/store";
import Logout from "./Components/Logout";
import LandingPage from "./pages/LandingPage/LandingPage";
import LandingAbout from "./pages/LandingAbout/LandingAbout";
import LandingFaqs from "./pages/LandingFaqs/LandingFaqs";

function App() {
  const logoutState = useSelector((state: RootState) =>
    state.logoutReducer.valueOf()
  );

  console.log("logout state ==> ", logoutState);
  return (
    <>
      <div className="App">
        <Navbar />
        {logoutState ? <Logout /> : null}
        {/* <Outlet /> */}
         <LandingPage /> 
        <LandingAbout />
        <LandingFaqs /> 
      </div>
    </>
  );
}

export default App;

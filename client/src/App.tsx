import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import "./App.css";
import { Outlet } from 'react-router-dom';
// import LandingPage from "./pages/LandingPage";
// import LandingAbout from "./pages/LandingAbout";
// import LandingFaqs from "./pages/LandingFaqs";

function App() {
  return (
    <>
      <div className="App">
        <Navbar />
        <Outlet />
        {/* <LandingPage /> */}
        {/* <LandingAbout />
        <LandingFaqs /> */}
      </div>
    </>
  );
}

export default App;

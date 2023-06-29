import './App.css';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
// import { Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LandingAbout from './pages/LandingAbout/LandingAbout';
import LandingFaqs from './pages/LandingFaqs/LandingFaqs';

function App() {
  return (
    <>
      <div className='App'>
        <Navbar />
        {/* <Outlet /> */}
        <LandingPage/>
        <LandingAbout/>
        <LandingFaqs/>
      </div>
    </>
  );
}

export default App;

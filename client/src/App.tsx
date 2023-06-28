import './App.css';
import Navbar from './Components/Navbar';
import { Outlet } from 'react-router-dom';
const App = () => {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default App;

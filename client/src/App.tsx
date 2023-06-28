import './App.css';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div className='App'>
        <Navbar></Navbar>
        <Outlet />
      </div>
    </>
  );
}

export default App;

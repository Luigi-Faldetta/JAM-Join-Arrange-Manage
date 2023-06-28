import './App.css';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
// import { Outlet } from 'react-router-dom';

import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';

function App() {
  return (
    <>
      <div className='App'>
        <Navbar></Navbar>
        {/* <Outlet /> */}
        <LoginScreen/>
        <RegisterScreen/>
      </div>
    </>
  );
}

export default App;

import './App.css';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './reduxFiles/store';
import Logout from './Components/Logout';


function App() {
  const logoutState = useSelector((state: RootState) =>
    state.logoutReducer.valueOf()
  );

  console.log('logout state ==> ', logoutState);
  return (
    <>
      <div className='App'>
        <Navbar />
        {logoutState ? <Logout /> : null}
        <Outlet />
      </div>
    </>
  );
}

export default App;

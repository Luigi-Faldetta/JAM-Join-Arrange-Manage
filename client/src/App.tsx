import React from 'react';
import logo from './logo.svg';
import './App.css';
import CreateEventForm from './Components/CreateEventForm';
import DefaultTabs from './Components/DefaultTabs';
import Event from './pages/event';

function App() {
  return (
    <div className="App">
      <Event></Event>
    </div>
  );
}

export default App;

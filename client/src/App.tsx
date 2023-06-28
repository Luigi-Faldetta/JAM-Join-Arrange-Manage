import React from "react";
import logo from "./logo.svg";
import "./App.css";
import CreateEventForm from "./Components/UserDashboard/CreateEventForm";
import CreateUserForm from "./Components/UserDashboard/CreateUserForm";
import Users from "./reduxFiles/slices/users";
import UserDashboardPage from "./Components/UserDashboard/UserDashboardPage";
import Navbar from "./Components/Navbar/Navbar";


function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <UserDashboardPage></UserDashboardPage>
      <CreateUserForm></CreateUserForm>
    </div>
  );
}

export default App;

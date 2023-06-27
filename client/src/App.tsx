import React from "react";
import logo from "./logo.svg";
import "./App.css";
import CreateEventForm from "./Components/UserDashboard/CreateEventForm";
import CreateUserForm from "./Components/UserDashboard/CreateUserForm";
import Users from "./reduxFiles/slices/users";
import UserDashboardPage from "./Components/UserDashboard/UserDashboardPage";

function App() {
  return (
    <div className="App">
      <UserDashboardPage></UserDashboardPage>
      <CreateUserForm></CreateUserForm>
    </div>
  );
}

export default App;

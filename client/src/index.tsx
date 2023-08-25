import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./reduxFiles/store";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LandingAbout from "./pages/LandingAbout/LandingAbout";
import LandingFaqs from "./pages/LandingFaqs/LandingFaqs";
import UserDashboardPage from "./pages/UserDashboard/UserDashboardPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LandingHero from "./pages/LandingHero/LandingHero";
import EventDashboard from "./pages/EventDashboard/EventDashboard";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ContactUs from "./pages/ContactUs/ContactUs";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<LandingHero />} />
      <Route path="/about" element={<LandingAbout />} />
      <Route path="/faqs" element={<LandingFaqs />} />
      <Route path="/user-dashboard" element={<UserDashboardPage />} />
      <Route path="/event/:eventid" element={<EventDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/passwordreset" element={<ForgotPasswordPage />} />
      <Route path="/contactus" element={<ContactUs />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);


serviceWorkerRegistration.unregister();

reportWebVitals();

import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import store from './reduxFiles/store';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Logout from './components/Logout';
import Delete from './components/Delete';
import AuthModal from './components/AuthModal/AuthModal';
import LandingPage from './pages/LandingPage/LandingPage';
import UserDashboardPage from './pages/UserDashboard/UserDashboardPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EventDashboard from './pages/EventDashboard/EventDashboard';
import LoginForm from './components/LandingDashboard/LoginForm';
import CreateUserForm from './components/LandingDashboard/CreateUserForm';
import ContactUs from './pages/ContactUs/ContactUs';
import SSOCallback from './components/SSOCallback/SSOCallback';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY as string;
if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

function Layout() {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Logout />
      <Delete setOpen={setDeleteOpen} />
      <AuthModal />
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route index element={<LandingPage />} />
      <Route path="event/:eventid" element={<LandingPage />} />
      <Route path="contact" element={<ContactUs />} />

      {/* Auth Routes */}
      <Route path="login" element={<LoginForm />} />
      <Route path="signup" element={<CreateUserForm />} />
      <Route path="sso-callback" element={<SSOCallback />} />

      {/* Protected Routes */}
      <Route path="user-dashboard" element={<UserDashboardPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="event-dashboard/:eventid" element={<EventDashboard />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ClerkProvider>
  );
}

export default App;

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
import SharedEventPage from './pages/SharedEventPage/SharedEventPage';
import LoginForm from './components/LandingDashboard/LoginForm';
import CreateUserForm from './components/LandingDashboard/CreateUserForm';
import ContactUs from './pages/ContactUs/ContactUs';
import SSOCallback from './components/SSOCallback/SSOCallback';
import { useClerkSync } from './hooks/useClerkSync';
import { TranslationProvider } from './hooks/useTranslation';
import { useTheme } from './hooks/useTheme';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY as string;
if (!clerkPubKey) {
  console.warn('Missing Clerk Publishable Key - some authentication features may not work');
}

function ClerkSyncWrapper({ children }: { children: React.ReactNode }) {
  useClerkSync();
  useTheme(); // Apply theme to document
  return <>{children}</>;
}

function Layout() {
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <ClerkSyncWrapper>
      <TranslationProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Logout />
          {deleteOpen && <Delete setOpen={setDeleteOpen} />}
          <AuthModal />
        </div>
      </TranslationProvider>
    </ClerkSyncWrapper>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route index element={<LandingPage />} />
      <Route path="event/:eventid" element={<SharedEventPage />} />
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
  const AppContent = () => (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );

  if (clerkPubKey) {
    return (
      <ClerkProvider 
        publishableKey={clerkPubKey}
        appearance={{
          baseTheme: undefined,
          variables: { 
            colorPrimary: '#8B5CF6' // Purple theme
          }
        }}
        signInUrl="/login"
        signUpUrl="/signup"
      >
        <AppContent />
      </ClerkProvider>
    );
  }

  // Fallback when Clerk is not configured
  return <AppContent />;
}

export default App;

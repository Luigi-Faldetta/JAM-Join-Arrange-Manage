import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';

function SSOCallback() {
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('SSOCallback: Starting Google OAuth callback handling', {
      userLoaded,
      isSignedIn,
      userExists: !!user,
      userId: user?.id,
    });

    // Clear any existing timeout
    if (redirectTimeout) {
      clearTimeout(redirectTimeout);
      setRedirectTimeout(null);
    }

    // Wait for Clerk to fully load
    if (!userLoaded) {
      console.log('SSOCallback: Waiting for Clerk to load...');
      return;
    }

    // If user is signed in, redirect to dashboard
    if (isSignedIn && user) {
      console.log('SSOCallback: User authenticated successfully, redirecting to dashboard');
      // Small delay to ensure useClerkSync has time to run
      const timeout = setTimeout(() => {
        navigate('/user-dashboard');
      }, 1500); // Increased delay for sync to complete
      setRedirectTimeout(timeout);
      return;
    }

    // If Clerk is loaded but user isn't signed in, something went wrong
    if (userLoaded && !isSignedIn) {
      console.log('SSOCallback: Authentication failed, redirecting to landing page');
      const timeout = setTimeout(() => {
        navigate('/');
      }, 2000);
      setRedirectTimeout(timeout);
    }

    // Cleanup function
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [navigate, userLoaded, isSignedIn, user, redirectTimeout]);

  // Show different messages based on state
  const getMessage = () => {
    if (!userLoaded) {
      return "Loading authentication...";
    }
    if (isSignedIn && user) {
      return "Sign in successful! Redirecting...";
    }
    if (userLoaded && !isSignedIn) {
      return "Authentication failed. Redirecting...";
    }
    return "Completing sign in...";
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-700 text-center">
            {getMessage()}
          </span>
          {userLoaded && isSignedIn && user && (
            <div className="text-sm text-gray-500 text-center">
              Welcome, {user.firstName || user.fullName || 'User'}!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SSOCallback;
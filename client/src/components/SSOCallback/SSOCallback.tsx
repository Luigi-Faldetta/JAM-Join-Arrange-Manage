import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SSOCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('SSOCallback: Clerk is handling authentication');
    // Clerk handles the OAuth flow automatically
    // The useClerkSync hook in App.tsx will sync the user with our backend
    // Just show a loading state briefly then redirect
    setTimeout(() => {
      navigate('/user-dashboard');
    }, 1000);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium text-gray-700">
          Completing sign in...
        </span>
      </div>
    </div>
  );
}

export default SSOCallback;
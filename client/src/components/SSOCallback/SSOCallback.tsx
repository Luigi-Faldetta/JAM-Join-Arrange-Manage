import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSocialLoginMutation } from '../../services/JamDB';

function SSOCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [socialLogin] = useSocialLoginMutation();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    console.log('SSOCallback: Starting OAuth callback processing');
    console.log('SSOCallback: URL:', window.location.href);
    console.log('SSOCallback: Search params object:', searchParams);
    console.log(
      'SSOCallback: Search params entries:',
      Object.fromEntries(searchParams)
    );
    console.log('SSOCallback: Search params size:', searchParams.size);

    // Log all individual parameters
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      console.log(`SSOCallback: Param ${key} = ${value}`);
    });

    // Also check the raw URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    console.log('SSOCallback: Raw URL search:', window.location.search);
    console.log('SSOCallback: Raw URL params:', Object.fromEntries(urlParams));

    if (hasProcessed) {
      console.log('SSOCallback: Already processed, skipping');
      return;
    }

    // Check if we're in a Google OAuth callback
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log('SSOCallback: Code from searchParams:', code);
    console.log('SSOCallback: State from searchParams:', state);

    // Also try getting from raw URL params
    const rawCode = urlParams.get('code');
    const rawState = urlParams.get('state');

    console.log('SSOCallback: Code from raw URL:', rawCode);
    console.log('SSOCallback: State from raw URL:', rawState);

    if (code || rawCode) {
      console.log('SSOCallback: Found Google OAuth code, processing...');
      setHasProcessed(true);
      handleGoogleCallback(code || rawCode!, state || rawState);
    } else {
      console.log('SSOCallback: No OAuth code found in either source');

      // Check if this might be a Clerk redirect instead
      if (window.location.href.includes('sso-callback')) {
        console.log(
          'SSOCallback: This appears to be a Clerk redirect, waiting longer...'
        );
        setTimeout(() => {
          if (!hasProcessed) {
            console.log(
              'SSOCallback: Still no code after waiting, redirecting to home'
            );
            navigate('/');
          }
        }, 5000);
      } else {
        console.log('SSOCallback: Redirecting to home immediately');
        setTimeout(() => navigate('/'), 2000);
      }
    }
  }, [searchParams, hasProcessed, navigate]);

  const handleGoogleCallback = async (code: string, state: string | null) => {
    try {
      const result = await socialLogin({ code, state: state ?? undefined });
      if ('data' in result && result.data) {
        localStorage.setItem('token', result.data.data);
        navigate('/user-dashboard');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Login Failed</h1>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium text-gray-700">
          Processing login...
        </span>
      </div>
    </div>
  );
}

export default SSOCallback;

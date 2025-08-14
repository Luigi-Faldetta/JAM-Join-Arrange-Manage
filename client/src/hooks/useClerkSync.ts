import { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useSyncClerkUserMutation } from '../services/JamDB';

export function useClerkSync() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [syncClerkUser] = useSyncClerkUserMutation();

  useEffect(() => {
    console.log('useClerkSync: Effect triggered', {
      userLoaded,
      isSignedIn,
      userExists: !!user,
      userId: user?.id,
    });

    const syncUser = async () => {
      // Wait for Clerk to fully load before proceeding
      if (!userLoaded) {
        console.log('useClerkSync: Waiting for Clerk to load');
        return;
      }

      // If user is not signed in and Clerk is loaded, we can proceed with other logic
      if (!isSignedIn) {
        console.log('useClerkSync: User not signed in, clearing any existing tokens');
        const existingToken = localStorage.getItem('token');
        if (existingToken) {
          localStorage.removeItem('token');
          console.log('useClerkSync: Removed stale token');
        }
        return;
      }

      // Only sync if user is loaded, signed in, and we have user data
      if (!user) {
        console.log('useClerkSync: No user data available yet');
        return;
      }

      // Add a longer delay to ensure Clerk OAuth flow is fully completed
      // This helps with slow loading issues during Google OAuth
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if we already have a token (meaning user is already synced)
      const existingToken = localStorage.getItem('token');
      const isGoogleOAuth = user.externalAccounts?.some(account => account.provider === 'oauth_google');
      
      console.log('useClerkSync: Token check', {
        tokenExists: !!existingToken,
        tokenPreview: existingToken ? existingToken.substring(0, 20) + '...' : 'none',
        isGoogleOAuth: isGoogleOAuth,
        userName: user.fullName,
        userEmail: user.primaryEmailAddress?.emailAddress,
      });
      
      if (existingToken) {
        console.log('useClerkSync: Validating existing token');
        // Verify the token is still valid by checking if we can fetch user data
        try {
          const baseUrl = process.env.NODE_ENV !== 'production'
            ? process.env.REACT_APP_API_BASE_URL || 'http://localhost:3200/'
            : process.env.REACT_APP_API_BASE_URL || 'https://jam-join-arrange-manage-production.up.railway.app';
          
          const apiUrl = baseUrl.endsWith('/') ? `${baseUrl}me` : `${baseUrl}/me`;
          const cleanToken = existingToken.replace(/["']/g, '').trim();
          
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${cleanToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('useClerkSync: Token validation response:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.name && data.data.email) {
              console.log('useClerkSync: Existing token is valid with complete user data, no sync needed');
              return; // Token is valid with complete data, no need to sync
            } else {
              console.log('useClerkSync: Token valid but user data incomplete, proceeding with sync');
            }
          } else {
            console.log('useClerkSync: Existing token is invalid (status:', response.status, '), proceeding with sync');
          }
        } catch (e) {
          console.log('useClerkSync: Token validation failed with error:', e, 'proceeding with sync');
        }
      }

      // For Google OAuth users, force re-sync if we don't have complete Clerk data
      if (isGoogleOAuth && (!user.fullName || !user.primaryEmailAddress?.emailAddress)) {
        console.log('useClerkSync: Google OAuth user with incomplete Clerk data, forcing sync...');
        // Remove existing token to force fresh sync
        if (existingToken) {
          localStorage.removeItem('token');
        }
      }

      try {
        console.log('Syncing Clerk user with backend...', {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName || 'User',
          profilePic: user.imageUrl,
        });

        const result = await syncClerkUser({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || user.firstName || 'User',
          profilePic: user.imageUrl,
        }).unwrap();

        console.log('Sync result:', result);

        if (result.success && result.data) {
          // Store the JWT token
          localStorage.setItem('token', result.data.token);
          console.log('Clerk user synced successfully, token stored');
          
          // Small delay to ensure token is stored before navigation
          setTimeout(() => {
            navigate('/user-dashboard');
          }, 100);
        } else {
          console.error('Sync failed - unexpected response:', result);
        }
      } catch (error: any) {
        console.error('Clerk sync error details:', {
          status: error?.status,
          data: error?.data,
          message: error?.message,
          error
        });
        
        if (error?.status === 404) {
          console.error('Clerk sync endpoint not found. This feature may not be deployed yet.');
        } else {
          console.error('Failed to sync Clerk user:', error);
        }
      }
    };

    syncUser();
  }, [userLoaded, isSignedIn, user, syncClerkUser, navigate]);
}
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
    const syncUser = async () => {
      // Only sync if user is loaded, signed in, and we have user data
      if (!userLoaded || !isSignedIn || !user) return;

      // Check if we already have a token (meaning user is already synced)
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        // Verify the token is still valid by checking if we can fetch user data
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3200'}/me`, {
            headers: {
              'Authorization': `Bearer ${existingToken}`
            }
          });
          if (response.ok) {
            return; // Token is valid, no need to sync
          }
        } catch (e) {
          // Token is invalid, continue with sync
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
          console.log('Clerk user synced successfully, token stored:', result.data.token);
          
          // Force refetch of user data
          window.location.href = '/user-dashboard';
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
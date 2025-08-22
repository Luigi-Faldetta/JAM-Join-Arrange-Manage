import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { RootState, useAppDispatch } from '../../reduxFiles/store';
import { setEventList } from '../../reduxFiles/slices/events';
import { openLogout } from '../../reduxFiles/slices/logout';
import { useGetEventsQuery, useGetMeQuery } from '../../services/JamDB';
import CreateEventForm from '../../components/UserDashboard/CreateEventForm';
import EventTile from '../../components/UserDashboard/EventTile';
import EventCalendar from '../../components/UserDashboard/EventCalendar';
import {
  FiCalendar,
  FiUsers,
  FiStar,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { useTranslation } from '../../hooks/useTranslation';

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const eventList = useSelector((state: RootState) => state.eventListReducer);
  const { t } = useTranslation();

  const [showCalendar, setShowCalendar] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMode, setFilterMode] = useState<'all' | 'hosting' | 'attending'>(
    'all'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [manualUserData, setManualUserData] = useState<any>(null);
  const [hasReceivedManualData, setHasReceivedManualData] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [localEvents, setLocalEvents] = useState<any[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Get Clerk user data
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  
  // Check for token availability
  const [hasToken, setHasToken] = useState(!!localStorage.getItem('token'));
  
  // Get user data from API - skip until token exists (moved up to declare refetchMe)
  const { data: userData, refetch: refetchMe, error: meError, isLoading: meLoading, isError: meIsError } = useGetMeQuery(undefined, {
    skip: !hasToken,
  });
  
  // Listen for token updates from Clerk sync
  useEffect(() => {
    const handleTokenUpdate = () => {
      console.log('UserDashboard: Token update event received');
      const newToken = localStorage.getItem('token');
      if (newToken && !hasToken) {
        console.log('UserDashboard: Token now available, enabling queries');
        setHasToken(true);
        // Trigger refetches now that token is available
        setTimeout(() => {
          console.log('UserDashboard: Refetching user data and events');
          refetchMe();
        }, 100);
      }
    };
    
    window.addEventListener('tokenUpdated', handleTokenUpdate);
    return () => window.removeEventListener('tokenUpdated', handleTokenUpdate);
  }, [hasToken, refetchMe]);
  
  // Use Clerk data as primary source, then API data, then manual data
  const user = userData?.data || manualUserData;
  const userId = user?.userId;
  
  // Create user display data from Clerk when available
  const displayUser = {
    ...user,
    name: user?.name || clerkUser?.fullName || clerkUser?.firstName || 'User',
    profilePic: user?.profilePic || clerkUser?.imageUrl || '/no-profile-picture-icon.png'
  };
  
  
  // Force refetch on component mount and periodically to ensure Google OAuth users get their data
  useEffect(() => {
    console.log('UserDashboard: Checking authentication state');
    const token = localStorage.getItem('token');
    console.log('UserDashboard: Token from localStorage:', token ? 'Present' : 'Missing');
    
    // Only refetch if query has been started (token exists)
    if (hasToken) {
      refetchMe();
    }
    
    // Manual API call as fallback (using same URL pattern as ProfilePage)
    if (token) {
      const cleanToken = token.replace(/["']/g, '').trim();
      console.log('UserDashboard: Making manual /me request');
      
      // Use the same URL pattern as RTK Query
      const baseUrl = process.env.NODE_ENV !== 'production'
        ? process.env.REACT_APP_API_BASE_URL || 'http://localhost:3200/'
        : process.env.REACT_APP_API_BASE_URL || 'https://jam-join-arrange-manage-production.up.railway.app';
      
      const apiUrl = baseUrl.endsWith('/') ? `${baseUrl}me` : `${baseUrl}/me`;
      
      fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log('UserDashboard: /me response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('UserDashboard: /me response data:', data);
        // Set manual data as fallback
        if (data.success && data.data) {
          console.log('UserDashboard: Setting manual user data:', data.data);
          setManualUserData(data.data);
          setHasReceivedManualData(true);
          // Force RTK Query to refetch to update cache
          setTimeout(() => {
            if (hasToken) {
              refetchMe();
            }
          }, 100);
        }
      })
      .catch(err => {
        console.error('UserDashboard: Manual /me request failed:', err);
      });
    } else {
      console.warn('UserDashboard: No token found in localStorage');
    }
  }, [refetchMe, hasToken]);

  // Additional effect to refetch user data when user object is incomplete or missing userId (for Google OAuth users)
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Retry if we haven't received manual data and user data is incomplete OR if we don't have userId
    const needsRetry = token && !hasReceivedManualData && (
      (!user || !user.name || !user.profilePic) || // Missing basic user data
      (!userId) // Missing userId which is critical for loading events
    );
    
    if (needsRetry) {
      console.log('UserDashboard: User data incomplete or missing userId, refetching...', {
        hasUser: !!user,
        hasName: !!user?.name,
        hasProfilePic: !!user?.profilePic,
        hasUserId: !!userId
      });
      
      // Retry multiple times with increasing delays for Google OAuth
      const retryAttempts = [500, 1500, 3000, 5000]; // Try after 0.5s, 1.5s, 3s, and 5s
      
      retryAttempts.forEach((delay, index) => {
        setTimeout(() => {
          console.log(`UserDashboard: Retry attempt ${index + 1} for user data`);
          if (hasToken) {
            refetchMe();
          }
        }, delay);
      });
    }
  }, [user, userId, refetchMe, hasReceivedManualData, hasToken]);

  // Get events - skip until we have both token and userId
  const { data: eventsData, isLoading, refetch: refetchEvents, error: eventsError } = useGetEventsQuery(userId || '', {
    skip: !hasToken || !userId,
  });

  // Force component update and refetch events when manual data is received
  useEffect(() => {
    if (hasReceivedManualData && manualUserData) {
      console.log('UserDashboard: Manual data received, forcing component update');
      // Refetch events when we get the userId from manual data
      if (manualUserData.userId && hasToken) {
        console.log('UserDashboard: Refetching events with userId:', manualUserData.userId);
        refetchEvents();
      }
    }
  }, [hasReceivedManualData, manualUserData, refetchEvents, hasToken]);
  
  // Debug logging for events loading
  console.log('Events Loading State:', {
    userId: userId,
    hasUserId: !!userId,
    eventsDataExists: !!eventsData?.data,
    eventsCount: eventsData?.data?.length || 0,
    isLoadingEvents: isLoading,
    eventListLength: eventList.length,
    eventsError: eventsError,
    hasManualUserData: !!manualUserData,
    hasUserData: !!userData?.data,
    // Debug Redux state mismatch
    eventsDataArray: eventsData?.data,
    reduxEventList: eventList
  });

  // Update event list when events data changes
  useEffect(() => {
    if (eventsData?.data) {
      console.log('UserDashboard: Setting event list with', eventsData.data.length, 'events');
      console.log('UserDashboard: Events data to dispatch:', eventsData.data);
      dispatch(setEventList(eventsData.data));
      
      // Also set local events as backup
      setLocalEvents(eventsData.data);
      
      // Force re-render by updating component state if Redux isn't updating properly
      setTimeout(() => {
        console.log('UserDashboard: Checking if Redux updated - eventList length:', eventList.length);
        if (eventList.length === 0 && eventsData.data.length > 0) {
          console.warn('UserDashboard: Redux state not updated, forcing another dispatch');
          dispatch(setEventList(eventsData.data));
        }
      }, 100);
    }
  }, [eventsData, dispatch, eventList.length]);
  
  // Refetch events whenever userId changes from undefined to a real value
  const [lastUserId, setLastUserId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (userId && userId !== 'no-user-id' && userId !== lastUserId) {
      console.log('UserDashboard: userId changed, refetching events:', { oldUserId: lastUserId, newUserId: userId });
      setLastUserId(userId);
      if (hasToken && userId) {
        refetchEvents();
      }
    }
  }, [userId, lastUserId, refetchEvents, hasToken]);
  
  // Monitor for userId becoming available from any source
  useEffect(() => {
    const userIdFromRTK = userData?.data?.userId;
    const userIdFromManual = manualUserData?.userId;
    const foundUserId = userIdFromRTK || userIdFromManual;
    
    if (foundUserId && foundUserId !== lastUserId && eventList.length === 0) {
      console.log('UserDashboard: Found userId from any source, triggering events refetch:', {
        foundUserId,
        fromRTK: userIdFromRTK,
        fromManual: userIdFromManual,
        lastUserId,
        eventListLength: eventList.length
      });
      setLastUserId(foundUserId);
      if (hasToken && foundUserId) {
        refetchEvents();
      }
    }
  }, [userData?.data?.userId, manualUserData?.userId, lastUserId, eventList.length, refetchEvents, hasToken]);
  
  // Use events from Redux state, with local events as fallback (moved up to avoid reference issues)
  const eventsToUse = eventList.length > 0 ? eventList : localEvents;
  
  // Final fallback: If we have userId but still no events after reasonable time, keep retrying
  useEffect(() => {
    if (userId && userId !== 'no-user-id' && eventsToUse.length === 0) {
      console.log('UserDashboard: Final fallback - have userId but no events, setting up polling');
      
      const pollInterval = setInterval(() => {
        console.log('UserDashboard: Polling for events...');
        if (hasToken && userId) {
          refetchEvents();
        }
      }, 2000); // Poll every 2 seconds
      
      // Stop polling after 20 seconds or when we get events
      const timeout = setTimeout(() => {
        console.log('UserDashboard: Stopping events polling after 20 seconds');
        clearInterval(pollInterval);
      }, 20000);
      
      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [userId, eventsToUse.length, refetchEvents, hasToken]);
  
  // Stop polling when events are loaded
  useEffect(() => {
    if (eventsToUse.length > 0) {
      console.log('UserDashboard: Events loaded, any active polling will be cleaned up on next render');
    }
  }, [eventsToUse.length]);

  // Debug logging for event source selection
  console.log('UserDashboard: Using events for filtering:', {
    reduxEventCount: eventList.length,
    localEventCount: localEvents.length,
    usingSource: eventList.length > 0 ? 'redux' : 'local'
  });

  // Filter events based on current filter mode
  const filteredEvents = eventsToUse.filter((event) => {
    // Search filter
    if (
      searchTerm &&
      !event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Role filter
    if (filterMode === 'hosting') {
      return event.UserEvents?.some(
        (userEvent: any) => userEvent.userId === userId && userEvent.isHost
      );
    } else if (filterMode === 'attending') {
      return event.UserEvents?.some(
        (userEvent: any) => userEvent.userId === userId && userEvent.isGoing
      );
    }

    return true;
  });

  // Calculate stats using the same event source
  const totalEvents = eventsToUse.length;
  const hostingEvents = eventsToUse.filter((event) =>
    event.UserEvents?.some(
      (userEvent: any) => userEvent.userId === userId && userEvent.isHost
    )
  ).length;
  const attendingEvents = eventsToUse.filter((event) =>
    event.UserEvents?.some(
      (userEvent: any) => userEvent.userId === userId && userEvent.isGoing
    )
  ).length;

  const stats = [
    {
      title: t.dashboard.stats.totalEvents,
      value: totalEvents,
      icon: FiCalendar,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
    },
    {
      title: t.dashboard.stats.hosting,
      value: hostingEvents,
      icon: FiStar,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
    },
    {
      title: t.dashboard.stats.attending,
      value: attendingEvents,
      icon: FiUsers,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
    },
  ];

  const handleSignOut = () => {
    dispatch(openLogout());
  };

  // Show loading state - use Clerk data if available to avoid waiting
  const hasValidUserData = user && user.name && user.name !== 'User';
  const hasDataFromEitherSource = userData?.data || hasReceivedManualData || (manualUserData && manualUserData.name);
  const hasClerkUserData = clerkLoaded && clerkUser && (clerkUser.fullName || clerkUser.firstName);
  
  // Only show loading if we don't have any user data from any source and haven't timed out
  const isLoadingUserData = (!hasValidUserData && !hasDataFromEitherSource && !hasClerkUserData) && !loadingTimeout;

  // Debug logging to help diagnose loading issues
  console.log('UserDashboard Loading State:', {
    hasValidUserData,
    hasDataFromEitherSource,
    hasClerkUserData,
    isLoadingUserData,
    userName: user?.name,
    clerkUserName: clerkUser?.fullName || clerkUser?.firstName,
    displayUserName: displayUser?.name,
    hasUserDataFromRTK: !!userData?.data,
    hasReceivedManualData,
    manualUserData,
    userData: userData?.data,
    loadingTimeout,
    clerkLoaded
  });

  // Timeout failsafe - if loading takes more than 10 seconds, force continue
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoadingUserData) {
        console.warn('Loading timeout reached, forcing dashboard to show');
        setLoadingTimeout(true);
      }
    }, 3000); // 3 second timeout (reduced since we use Clerk data immediately)

    return () => clearTimeout(timer);
  }, [isLoadingUserData]);

  if (isLoadingUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t.dashboard.loading}
            </h2>
            <p className="text-gray-600">
              {t.dashboard.syncingProfile}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Profile and Sign Out Buttons */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-3 mb-6 sm:mb-0">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 group border border-gray-200 hover:border-purple-400"
          title={t.nav.settings}
        >
          <FiSettings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
        
        {/* Profile Button */}
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400"
        >
          <img
            src={displayUser?.profilePic || '/no-profile-picture-icon.png'}
            alt={t.common.altText.profile}
            className="w-full h-full object-cover"
          />
        </button>
        
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          <FiLogOut className="w-4 h-4" />
          <span>{t.nav.signOut}</span>
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  {t.dashboard.welcome}, {displayUser?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-gray-600 text-lg">
                  {t.dashboard.welcomeSubtext}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <CreateEventForm />
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    showCalendar
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <FiCalendar className="w-4 h-4" />
                  <span>{t.dashboard.calendar}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar Section */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <EventCalendar
                sortedEventList={eventsToUse
                  .filter((e) => typeof e.eventId === 'string')
                  .map((e) => ({
                    ...(e as any),
                    eventId: e.eventId as string,
                  }))}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Events Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t.dashboard.yourEvents}
                </h2>
                <p className="text-gray-300">
                  {t.dashboard.manageEvents}
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.dashboard.searchEvents}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center space-x-2">
                  <FiFilter className="w-4 h-4 text-gray-300" />
                  <select
                    value={filterMode}
                    onChange={(e) =>
                      setFilterMode(
                        e.target.value as 'all' | 'hosting' | 'attending'
                      )
                    }
                    className="bg-white/10 border border-white/20 rounded-xl text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  >
                    <option value="all" className="text-gray-900">
                      {t.dashboard.filter.all}
                    </option>
                    <option value="hosting" className="text-gray-900">
                      {t.dashboard.filter.hosting}
                    </option>
                    <option value="attending" className="text-gray-900">
                      {t.dashboard.filter.attending}
                    </option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Events Content */}
          <div className="p-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-2xl h-64 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.eventId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <EventTile
                      event={event}
                      userId={userId}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FiCalendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || filterMode !== 'all'
                    ? t.dashboard.noEventsFound
                    : t.dashboard.noEvents}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm || filterMode !== 'all'
                    ? t.dashboard.noEventsFoundDescription
                    : t.dashboard.noEventsDescription}
                </p>
                {!searchTerm && filterMode === 'all' && <CreateEventForm />}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </div>
  );
}

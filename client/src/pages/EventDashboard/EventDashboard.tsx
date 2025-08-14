import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventData from '../../components/EventDashboard/EventData';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Todos from '../../components/EventDashboard/Todos';
import Expenses from '../../components/EventDashboard/Expenses';
import Attendees from '../../components/EventDashboard/Attendees';
import { useGetEventQuery, useGetMeQuery, useJoinEventMutation } from '../../services/JamDB';
import { useIsLoggedIn } from '../../utils/useIsLoggedIn';
import { EventState } from '../../reduxFiles/slices/events';
import LandingPage from '../LandingPage/LandingPage';
import {
  FiArrowLeft,
  FiLogOut,
  FiUsers,
  FiDollarSign,
  FiCheckSquare,
  FiShare2,
  FiSettings,
} from 'react-icons/fi';
import { useAppDispatch } from '../../reduxFiles/store';
import { openLogout } from '../../reduxFiles/slices/logout';

export default function EventDashboard() {
  const [userIsHost, setUserIsHost] = useState<boolean>(false);
  const [showTodos, setShowTodos] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [hasAutoJoined, setHasAutoJoined] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Replace token usage with proper user data
  const { data: userData } = useGetMeQuery();
  const loggedUserId = userData?.data?.userId;
  const user = userData?.data;

  const isLoggedIn = useIsLoggedIn();
  const { eventid } = useParams();
  const { data: eventData, isLoading, refetch: refetchEvent } = useGetEventQuery(eventid as string);
  const [joinEvent] = useJoinEventMutation();

  useEffect(() => {
    if (!loggedUserId || !eventData?.data?.UserEvents) return;

    const hostUser = eventData.data.UserEvents.find(
      (user: EventState['UserEvents'][0]) => user.isHost
    );
    setUserIsHost(hostUser?.userId === loggedUserId);

    const isJoinedCheck = eventData.data.UserEvents.some(
      (user: any) => user.userId === loggedUserId
    );
    setIsJoined(isJoinedCheck);
  }, [eventData, loggedUserId]);

  // Auto-join logic for users coming from shared links
  useEffect(() => {
    const autoJoinEvent = async () => {
      // Check if user came from a shared event link
      const urlParams = new URLSearchParams(location.search);
      const cameFromSharedLink = location.state?.fromSharedLink || 
        urlParams.get('fromSharedLink') === 'true' ||
        (document.referrer && document.referrer.includes(`/event/${eventid}`));
      
      if (!hasAutoJoined && !isJoined && loggedUserId && eventid && cameFromSharedLink && !userIsHost) {
        setHasAutoJoined(true);
        
        try {
          const result = await joinEvent({
            eventId: eventid,
            userId: loggedUserId,
          });
          
          if ('data' in result && result.data.success) {
            // Refetch event data to update attendees list
            refetchEvent();
            setIsJoined(true);
          }
        } catch (error) {
          console.error('Error auto-joining event:', error);
        }
      }
    };

    if (loggedUserId && eventData && !isLoading) {
      autoJoinEvent();
    }
  }, [loggedUserId, eventData, isLoading, hasAutoJoined, isJoined, userIsHost, eventid, joinEvent, refetchEvent, location.state, location.search]);

  const handleBackToDashboard = () => {
    navigate('/user-dashboard');
  };

  const handleSignOut = () => {
    dispatch(openLogout());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading event...</p>
        </div>
      </div>
    );
  }
  
  if (!isLoggedIn || !eventData) {
    return <LandingPage eventData={eventData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Modern Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side - Back button and Event info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
              >
                <FiArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline font-medium">Dashboard</span>
              </button>

              <div className="hidden md:block w-px h-8 bg-gray-300"></div>

              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate max-w-xs sm:max-w-md">
                    {eventData.data.title}
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    {eventData.data.location || 'Location not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - User info and actions */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              {user && (
                <div className="hidden sm:flex items-center space-x-3">
                  <img
                    src={user?.profilePic || '/no-profile-picture-icon.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {userIsHost ? 'Host' : 'Attendee'}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-purple-400"
                  title="Profile"
                >
                  <img
                    src={user?.profilePic || '/no-profile-picture-icon.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  title="Sign Out"
                >
                  <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline text-sm font-medium">
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Event Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <EventData
              eventData={eventData}
              userIsHost={userIsHost}
              showTodos={showTodos}
              setShowTodos={setShowTodos}
              isJoined={isJoined}
              loggedUser={loggedUserId ?? ''}
              setIsJoined={setIsJoined}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Management Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setShowTodos(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      showTodos
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <FiCheckSquare className="w-4 h-4" />
                    <span>Tasks</span>
                  </button>

                  <button
                    onClick={() => setShowTodos(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      !showTodos
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <FiDollarSign className="w-4 h-4" />
                    <span>Expenses</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {showTodos ? (
                  <motion.div
                    key="todos"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Todos />
                  </motion.div>
                ) : (
                  <motion.div
                    key="expenses"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Expenses />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Attendees Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {/* Attendees Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiUsers className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Event Attendees
                    </h2>
                    <p className="text-blue-100">
                      See who's coming to your event
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FiShare2 className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium text-white">
                    Share Event
                  </span>
                </div>
              </div>
            </div>

            {/* Attendees Content */}
            <div className="p-8">
              <Attendees />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

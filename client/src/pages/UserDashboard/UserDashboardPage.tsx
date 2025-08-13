import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from 'react-icons/fi';

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const eventList = useSelector((state: RootState) => state.eventListReducer);

  const [showCalendar, setShowCalendar] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMode, setFilterMode] = useState<'all' | 'hosting' | 'attending'>(
    'all'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [manualUserData, setManualUserData] = useState<any>(null);

  // Get user data
  const { data: userData, refetch: refetchMe, error: meError, isLoading: meLoading, isError: meIsError } = useGetMeQuery();
  
  // Use manual data as fallback when RTK Query fails
  const user = userData?.data || manualUserData;
  const userId = user?.userId;
  
  
  // Force refetch on component mount
  useEffect(() => {
    refetchMe();
    
    // Manual API call as fallback
    const token = localStorage.getItem('token');
    if (token) {
      const cleanToken = token.replace(/["']/g, '').trim();
      fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://jam-join-arrange-manage-production.up.railway.app'}/me`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`
        }
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        
        // Set manual data as fallback
        if (data.success && data.data) {
          setManualUserData(data.data);
        }
      })
      .catch(err => {
        // Silently handle error - RTK Query should work now
      });
    }
  }, [refetchMe]);

  // Get events
  const { data: eventsData, isLoading } = useGetEventsQuery(userId || '', {
    skip: !userId,
  });

  useEffect(() => {
    if (eventsData?.data) {
      dispatch(setEventList(eventsData.data));
    }
  }, [eventsData, dispatch]);

  // Filter events based on current filter mode
  const filteredEvents = eventList.filter((event) => {
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
        (userEvent) => userEvent.userId === userId && userEvent.isHost
      );
    } else if (filterMode === 'attending') {
      return event.UserEvents?.some(
        (userEvent) => userEvent.userId === userId && !userEvent.isHost
      );
    }

    return true;
  });

  // Calculate stats
  const totalEvents = eventList.length;
  const hostingEvents = eventList.filter((event) =>
    event.UserEvents?.some(
      (userEvent) => userEvent.userId === userId && userEvent.isHost
    )
  ).length;
  const attendingEvents = totalEvents - hostingEvents;

  const stats = [
    {
      title: 'Total Events',
      value: totalEvents,
      icon: FiCalendar,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Hosting',
      value: hostingEvents,
      icon: FiStar,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Attending',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Profile and Sign Out Buttons */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-3">
        {/* Profile Button */}
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400"
        >
          <img
            src={user?.profilePic || '/no-profile-picture-icon.png'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
        
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your events and connect with friends
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
                  <span>Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
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
                sortedEventList={eventList
                  .filter((e) => typeof e.eventId === 'string')
                  .map((e) => ({
                    ...(e as any),
                    eventId: e.eventId as string,
                  }))}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
                  Your Events
                </h2>
                <p className="text-gray-300">
                  Manage and track all your events
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
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
                      All Events
                    </option>
                    <option value="hosting" className="text-gray-900">
                      Hosting
                    </option>
                    <option value="attending" className="text-gray-900">
                      Attending
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
                    ? 'No events found'
                    : 'No events yet'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm || filterMode !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first event to get started and bring people together!'}
                </p>
                {!searchTerm && filterMode === 'all' && <CreateEventForm />}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

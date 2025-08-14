import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetEventQuery, useGetMeQuery } from '../../services/JamDB';
import { useIsLoggedIn } from '../../utils/useIsLoggedIn';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../../reduxFiles/slices/authModal';
import { FiCalendar, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';

export default function SharedEventPage() {
  const { eventid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useIsLoggedIn();
  
  const { data: eventData, isLoading: eventLoading } = useGetEventQuery(eventid as string);
  const { data: userData } = useGetMeQuery(undefined, { skip: !isLoggedIn });

  useEffect(() => {
    // If user is not logged in, show auth modal
    if (!isLoggedIn && !eventLoading && eventData) {
      dispatch(openAuthModal('signin'));
    }
  }, [isLoggedIn, eventLoading, eventData, dispatch]);

  useEffect(() => {
    // If user is logged in, redirect to event dashboard
    if (isLoggedIn && eventData && userData) {
      navigate(`/event-dashboard/${eventid}`, { replace: true });
    }
  }, [isLoggedIn, eventData, userData, eventid, navigate]);

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!eventData || !eventData.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const event = eventData.data;
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 relative">
      {/* Blurred Background Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`min-h-screen py-20 px-4 ${!isLoggedIn ? 'filter blur-md' : ''}`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
          >
            {/* Event Cover Image or Gradient */}
            <div className="h-64 relative overflow-hidden">
              {event.coverPic ? (
                <>
                  <img 
                    src={event.coverPic} 
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
                {event.description && (
                  <p className="text-lg opacity-90">{event.description}</p>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
                    <p className="text-gray-600">{event.date ? formatDate(event.date) : 'Date to be announced'}</p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FiClock className="w-4 h-4 mr-1" />
                      {event.date ? formatTime(event.date) : 'Time to be announced'}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">{event.location || 'Location to be announced'}</p>
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiUsers className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Attendees</h3>
                    <p className="text-gray-600">
                      {event.UserEvents?.length || 0} people attending
                    </p>
                  </div>
                </div>

                {/* Host */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiUsers className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hosted by</h3>
                    <p className="text-gray-600">
                      {event.UserEvents?.find((ue: any) => ue.isHost)?.User?.name || 'Unknown Host'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Message */}
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Want to join this event?
                </h3>
                <p className="text-gray-600 mb-4">
                  Sign in or create an account to view full event details and confirm your attendance.
                </p>
                <button
                  onClick={() => dispatch(openAuthModal('signin'))}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Sign in to Join Event
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
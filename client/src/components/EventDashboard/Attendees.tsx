import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetUsersQuery } from '../../services/JamDB';
import { createUserList } from '../../reduxFiles/slices/users';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../reduxFiles/store';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiLoader,
  FiUserPlus,
} from 'react-icons/fi';

export default function Attendees() {
  const { eventid } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const usersPerPage = 8;
  const appDispatch = useAppDispatch();
  const attendees = useSelector((state: RootState) => state.userList);
  const { t } = useTranslation();

  const { data, error, isLoading } = useGetUsersQuery(eventid as string);

  useEffect(() => {
    if (data) {
      const fetchedUsers = data.data;
      appDispatch(createUserList(fetchedUsers));
    }
  }, [data, appDispatch]);

  const totalPages = Math.ceil(attendees.length / usersPerPage);
  const startIndex = currentPage * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, attendees.length);
  const currentAttendees = attendees.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex items-center space-x-2 text-gray-600">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>{t.event.loadingAttendees}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <FiUsers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {attendees.length}
            </h2>
            <p className="text-gray-600 font-medium">
              {attendees.length === 1 ? t.event.personGoing : t.event.peopleGoing}
            </p>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm text-gray-600 px-3">
              {currentPage + 1} {t.event.pageOf} {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Attendees Grid */}
      {attendees.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <AnimatePresence mode="wait">
            {currentAttendees.map((attendee, index) => {
              const isHost = (attendee as any).UserEvents?.[0]?.isHost;

              return (
                <motion.div
                  key={`${attendee.userId}-${currentPage}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  className="relative group"
                  onMouseEnter={() => setHoveredUser(attendee.userId ?? null)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    {/* Profile Image */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-4 transition-all duration-300 ${
                          isHost
                            ? 'ring-gradient-to-r from-purple-500 to-pink-500'
                            : 'ring-blue-200 group-hover:ring-blue-400'
                        } ${
                          hoveredUser === attendee.userId ? 'scale-110' : ''
                        }`}
                      >
                        <img
                          src={
                            attendee.profilePic ||
                            'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688557267/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju_wprc8v.jpg'
                          }
                          alt={attendee.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Host Badge */}
                      {isHost && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                        >
                          <FiStar className="w-3 h-3 text-white" />
                        </motion.div>
                      )}

                      {/* Online Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Name */}
                    <div className="text-center">
                      <p
                        className={`text-sm font-medium transition-colors duration-200 ${
                          hoveredUser === attendee.userId
                            ? 'text-blue-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {attendee.name}
                      </p>
                      {isHost && (
                        <p className="text-xs text-purple-600 font-medium">
                          {t.event.host}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hover Card */}
                  <AnimatePresence>
                    {hoveredUser === attendee.userId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
                      >
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-48">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                attendee.profilePic ||
                                'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688557267/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju_wprc8v.jpg'
                              }
                              alt={attendee.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {attendee.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {isHost ? t.event.eventHost : t.event.attendee}
                              </p>
                              {attendee.email && (
                                <p className="text-xs text-gray-500 truncate max-w-32">
                                  {attendee.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiUserPlus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t.event.noAttendeesYet}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {t.event.shareEventInvite}
          </p>
        </motion.div>
      )}

      {/* Page Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentPage
                  ? 'bg-blue-600 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

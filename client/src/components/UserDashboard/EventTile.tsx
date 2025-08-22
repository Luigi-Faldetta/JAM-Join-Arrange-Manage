import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { EventState } from '../../reduxFiles/slices/events';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiStar,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi';

interface EventTileProps {
  event: EventState;
  userId?: string;
  viewMode?: 'grid' | 'list';
}

export default function EventTile({
  event,
  userId,
  viewMode = 'grid',
}: EventTileProps) {
  const navigate = useNavigate();
  const { t, formatDate, formatRelativeTime } = useTranslation();

  const isHost = event.UserEvents?.some(
    (userEvent) => userEvent.userId === userId && userEvent.isHost
  );

  const attendeeCount = event.UserEvents?.length || 0;
  const eventDate = moment(event.date);
  const isUpcoming = eventDate.isAfter(moment());
  const timeFromNow = formatRelativeTime(event.date);

  const handleEventClick = () => {
    navigate(`/event-dashboard/${event.eventId}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleEventClick}
        className="bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <div className="flex items-center p-6">
          {/* Event Image */}
          <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden mr-6">
            <img
              src={
                event.coverPic ||
                'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688544322/friends-placeholder_ljftyb.png'
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {event.title}
                  </h3>
                  {isHost && (
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      <FiStar className="w-3 h-3" />
                      <span>{t.eventTile.host}</span>
                    </div>
                  )}
                  <div
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      isUpcoming
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isUpcoming ? t.eventTile.upcoming : t.eventTile.past}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDate(event.date, 'MMM D, YYYY')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>{timeFromNow}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiUsers className="w-4 h-4" />
                    <span>{attendeeCount} {t.eventTile.attending}</span>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                    <FiMapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              <FiArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleEventClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            event.coverPic ||
            'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688544322/friends-placeholder_ljftyb.png'
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          {isHost && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              <FiStar className="w-3 h-3" />
              <span>{t.eventTile.host}</span>
            </div>
          )}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isUpcoming ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            {isUpcoming ? t.eventTile.upcoming : t.eventTile.past}
          </div>
        </div>

        {/* Attendee Count */}
        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
          <FiUsers className="w-3 h-3" />
          <span>{attendeeCount}</span>
        </div>

        {/* Event Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="flex items-center space-x-2 text-gray-600">
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {formatDate(event.date, 'ddd, MMM D - h:mm A')}
            </span>
          </div>

          {/* Time from now */}
          <div className="flex items-center space-x-2 text-gray-600">
            <FiClock className="w-4 h-4" />
            <span className="text-sm">{timeFromNow}</span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center space-x-2 text-gray-600">
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm truncate">{event.location}</span>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-3">
              {event.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-purple-600 font-medium group-hover:text-purple-700 transition-colors duration-200">
            <span>{t.eventTile.manageEvent}</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

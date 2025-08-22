import React, { useState } from 'react';
import moment from 'moment';
import ToggleButton from './ToggleButton';
import EventLink from './EventLink';
import EditEvent from './EditEvent';
import DeleteEvent from './DeleteEvent';
import { useTranslation } from '../../hooks/useTranslation';
import { useGetUsersQuery } from '../../services/JamDB';
import { useParams } from 'react-router-dom';
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiUsers,
  FiStar,
  FiEdit3,
  FiTrash2,
  FiShare2,
  FiInfo,
  FiTag,
} from 'react-icons/fi';

interface EventDataProps {
  eventData: any;
  userIsHost: boolean;
  showTodos: boolean;
  setShowTodos: (show: boolean) => void;
  isJoined: boolean;
  loggedUser: string;
  setIsJoined: (joined: boolean) => void;
  isLoading: boolean;
}

export default function EventData({
  eventData,
  userIsHost,
  showTodos,
  setShowTodos,
  isJoined,
  loggedUser,
  setIsJoined,
  isLoading,
}: EventDataProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t, formatDate, formatRelativeTime } = useTranslation();
  const { eventid } = useParams();

  // Fetch actual attendee count using the same query as Attendees component
  const { data: usersData } = useGetUsersQuery(eventid as string, {
    skip: !eventid, // Skip if no eventId
  });

  if (isLoading || !eventData?.data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-600 dark:border-gray-700 overflow-hidden">
        <div className="h-64 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
        <div className="p-8 space-y-4">
          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  const event = eventData.data;
  const eventDate = moment(event.date);
  const isUpcoming = eventDate.isAfter(moment());
  // Use actual user count from API instead of potentially stale UserEvents array
  const attendeeCount = usersData?.data?.length || event.UserEvents?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-600 dark:border-gray-700 overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={
            event.coverPic ||
            'https://res.cloudinary.com/dpzz6vn2w/image/upload/v1688544322/friends-placeholder_ljftyb.png'
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Event Status Badge */}
        <div className="absolute top-6 left-6">
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              isUpcoming ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            <FiCalendar className="w-4 h-4" />
            <span>{isUpcoming ? t.eventData.upcomingEvent : t.eventData.pastEvent}</span>
          </div>
        </div>

        {/* Host Badge */}
        {userIsHost && (
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              <FiStar className="w-4 h-4" />
              <span>{t.eventData.youreTheHost}</span>
            </div>
          </div>
        )}

        {/* Event Title and Basic Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white">
            <div className="flex items-center space-x-2">
              <FiCalendar className="w-5 h-5" />
              <span className="font-medium">
                {formatDate(eventDate, 'dddd, MMMM D, YYYY')}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <FiClock className="w-5 h-5" />
              <span className="font-medium">{formatDate(eventDate, 'h:mm A')}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FiUsers className="w-5 h-5" />
              <span className="font-medium">
                {attendeeCount} {attendeeCount === 1 ? t.eventData.personAttending : t.eventData.peopleAttending}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {event.description && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FiInfo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.eventData.aboutThisEvent}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FiMapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.eventData.location}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{event.location}</p>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FiTag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.eventData.tags}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            {/* Join/Leave Event */}
            {!userIsHost && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t.eventData.eventParticipation}
                </h3>
                <ToggleButton
                  isJoined={isJoined}
                  loggedUser={loggedUser}
                  setIsJoined={setIsJoined}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Share Event */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-2 mb-4">
                <FiShare2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.eventData.shareEvent}
                </h3>
              </div>
              <EventLink eventid={event.eventId} />
            </div>

            {/* Host Actions */}
            {userIsHost && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t.eventData.hostActions}
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    <span>{t.eventData.editEvent}</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>{t.eventData.deleteEvent}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Event Stats */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t.eventData.eventStatistics}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t.eventData.totalAttendees}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {attendeeCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t.eventData.eventStatus}</span>
                  <span
                    className={`font-semibold ${
                      isUpcoming ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isUpcoming ? t.eventData.upcoming : t.eventData.completed}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t.eventData.timeUntilEvent}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatRelativeTime(eventDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditEvent
        open={showEditModal}
        setOpen={setShowEditModal}
        eventData={event}
      />

      <DeleteEvent
        open={showDeleteModal}
        eventId={event.eventId}
        eventTitle={event.title}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

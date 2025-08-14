import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiMapPin,
} from 'react-icons/fi';

interface Event {
  eventId: string;
  title: string;
  date: string;
  location?: string;
  UserEvents?: Array<{ isHost: boolean }>;
}

interface EventCalendarProps {
  sortedEventList: Event[];
}

function EventCalendar({ sortedEventList }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(moment());
  const [hoveredDay, setHoveredDay] = useState<moment.Moment | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const startOfMonth = currentDate.clone().startOf('month');
  const endOfMonth = currentDate.clone().endOf('month');
  const startOfCalendar = startOfMonth.clone().startOf('week');
  const endOfCalendar = endOfMonth.clone().endOf('week');

  const calendarDays = [];
  let day = startOfCalendar.clone();

  while (day.isSameOrBefore(endOfCalendar)) {
    calendarDays.push(day.clone());
    day.add(1, 'day');
  }

  const getEventsForDay = (date: moment.Moment) => {
    return sortedEventList.filter(
      (event) =>
        moment(event.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) =>
      direction === 'prev'
        ? prev.clone().subtract(1, 'month')
        : prev.clone().add(1, 'month')
    );
  };

  const isToday = (date: moment.Moment) => {
    return date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
  };

  const isCurrentMonth = (date: moment.Moment) => {
    return date.month() === currentDate.month();
  };

  const handleDayMouseEnter = (date: moment.Moment, event: React.MouseEvent) => {
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 320; // Approximate width of tooltip
      const tooltipHeight = Math.min(200, dayEvents.length * 60 + 80); // Dynamic height based on events
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Calculate initial position centered above the cell
      let x = rect.left + scrollX + rect.width / 2;
      let y = rect.top + scrollY - tooltipHeight - 10; // 10px gap above the cell
      
      // Adjust x position to keep tooltip in viewport
      const leftBoundary = scrollX + 10;
      const rightBoundary = scrollX + viewportWidth - 10;
      
      if (x - tooltipWidth / 2 < leftBoundary) {
        x = leftBoundary + tooltipWidth / 2; // Keep 10px from left edge
      } else if (x + tooltipWidth / 2 > rightBoundary) {
        x = rightBoundary - tooltipWidth / 2; // Keep 10px from right edge
      }
      
      // If tooltip would be cut off at top, show below the cell instead
      const topBoundary = scrollY + 10;
      if (y < topBoundary) {
        y = rect.bottom + scrollY + 10;
        
        // Double check if there's enough space below
        if (y + tooltipHeight > scrollY + viewportHeight - 10) {
          // Not enough space above or below, position in the middle of viewport
          y = scrollY + (viewportHeight - tooltipHeight) / 2;
        }
      }
      
      setTooltipPosition({ x, y });
      setHoveredDay(date);
    }
  };

  const handleDayMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiCalendar className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">
              {currentDate.format('MMMM YYYY')}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDay(date);
            const hasEvents = dayEvents.length > 0;
            const isCurrentDay = isToday(date);
            const isInCurrentMonth = isCurrentMonth(date);

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`
                  relative p-2 min-h-[40px] rounded-lg cursor-pointer transition-all duration-200
                  ${
                    isCurrentDay
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : hasEvents
                      ? 'bg-purple-50 hover:bg-purple-100'
                      : 'hover:bg-gray-50'
                  }
                  ${!isInCurrentMonth ? 'opacity-40' : ''}
                `}
                onMouseEnter={(e) => handleDayMouseEnter(date, e)}
                onMouseLeave={handleDayMouseLeave}
              >
                <div
                  className={`
                  text-sm font-medium text-center
                  ${
                    isCurrentDay
                      ? 'text-white'
                      : isInCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }
                `}
                >
                  {date.format('D')}
                </div>

                {/* Event Indicators */}
                {hasEvents && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => {
                        const isHost = event.UserEvents?.[0]?.isHost;
                        return (
                          <div
                            key={eventIndex}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCurrentDay
                                ? 'bg-white'
                                : isHost
                                ? 'bg-purple-600'
                                : 'bg-blue-500'
                            }`}
                            title={event.title}
                          />
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCurrentDay ? 'bg-white' : 'bg-gray-400'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      {sortedEventList.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Upcoming Events
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sortedEventList
              .filter((event) => moment(event.date).isAfter(moment()))
              .slice(0, 5)
              .map((event, index) => {
                const eventDate = moment(event.date);
                const isHost = event.UserEvents?.[0]?.isHost;

                return (
                  <motion.div
                    key={event.eventId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isHost ? 'bg-purple-600' : 'bg-blue-500'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <FiClock className="w-3 h-3" />
                        <span>{eventDate.format('MMM D, h:mm A')}</span>
                        {event.location && (
                          <>
                            <FiMapPin className="w-3 h-3" />
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
            <span className="text-gray-600">Hosting</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Attending</span>
          </div>
        </div>
      </div>

      {/* Event Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-xs">
              {/* Tooltip Header */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {hoveredDay.format('MMMM D, YYYY')}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {getEventsForDay(hoveredDay).length} event{getEventsForDay(hoveredDay).length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {getEventsForDay(hoveredDay).slice(0, 3).map((event, index) => {
                  const eventTime = moment(event.date);
                  const isHost = event.UserEvents?.[0]?.isHost;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div 
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isHost ? 'bg-purple-600' : 'bg-blue-500'
                          }`}
                        />
                        <h5 className="font-medium text-gray-900 text-sm truncate">
                          {event.title}
                        </h5>
                      </div>
                      
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <FiClock className="w-3 h-3 flex-shrink-0" />
                          <span>{eventTime.format('h:mm A')}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <FiMapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {getEventsForDay(hoveredDay).length > 3 && (
                  <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                    +{getEventsForDay(hoveredDay).length - 3} more event{getEventsForDay(hoveredDay).length - 3 !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 top-full transform -translate-x-1/2">
                <div className="w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45 -mt-1.5"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EventCalendar;

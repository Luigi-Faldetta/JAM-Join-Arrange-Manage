import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  useJoinEventMutation,
  useLeaveEventMutation,
} from '../../services/JamDB';
import {
  FiUserPlus,
  FiUserMinus,
  FiLoader,
  FiCheck,
  FiHeart,
} from 'react-icons/fi';

interface ToggleButtonProps {
  isJoined: boolean;
  loggedUser: string;
  setIsJoined: (joined: boolean) => void;
  isLoading: boolean;
}

export default function ToggleButton({
  isJoined,
  loggedUser,
  setIsJoined,
  isLoading,
}: ToggleButtonProps) {
  const { eventid } = useParams();
  const [joinEvent] = useJoinEventMutation();
  const [leaveEvent] = useLeaveEventMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = async () => {
    if (!loggedUser || isProcessing) return;

    setIsProcessing(true);

    try {
      if (isJoined) {
        const result = await leaveEvent({
          eventId: eventid as string,
          userId: loggedUser,
        });

        if ('data' in result && result.data.success) {
          setIsJoined(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      } else {
        const result = await joinEvent({
          eventId: eventid as string,
          userId: loggedUser,
        });

        if ('data' in result && result.data.success) {
          setIsJoined(true);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      }
    } catch (error) {
      console.error('Error toggling event participation:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-32 h-12 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        disabled={isProcessing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative overflow-hidden flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 min-w-32 h-12
          ${
            isJoined
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
          }
          ${isProcessing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        `}
      >
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: '-100%' }}
          animate={{ x: isProcessing ? '100%' : '-100%' }}
          transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
        />

        {/* Button Content */}
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <FiCheck className="w-4 h-4" />
              <span>{isJoined ? 'Joined!' : 'Left!'}</span>
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <FiLoader className="w-4 h-4 animate-spin" />
              <span>{isJoined ? 'Leaving...' : 'Joining...'}</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              {isJoined ? (
                <>
                  <FiUserMinus className="w-4 h-4" />
                  <span>Leave Event</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="w-4 h-4" />
                  <span>Join Event</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 text-xs"
      >
        {isJoined ? (
          <>
            <FiHeart className="w-3 h-3 text-red-500" />
            <span className="text-gray-600">You're attending</span>
          </>
        ) : (
          <>
            <FiHeart className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">Not attending</span>
          </>
        )}
      </motion.div>
    </div>
  );
}

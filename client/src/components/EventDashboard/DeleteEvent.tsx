import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDeleteEventMutation } from '../../services/JamDB';
import { useAppDispatch } from '../../reduxFiles/store';
import { deleteEventFromList } from '../../reduxFiles/slices/events';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FiTrash2,
  FiX,
  FiAlertTriangle,
  FiLoader,
} from 'react-icons/fi';

interface DeleteEventProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
  open: boolean;
}

function DeleteEvent({ eventId, eventTitle, onClose, open }: DeleteEventProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [deleteEvent] = useDeleteEventMutation();
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  async function handleDelete() {
    setIsDeleting(true);
    setErrorMessage('');
    
    try {
      const res = await deleteEvent(eventId);
      if ('data' in res && res.data.success) {
        dispatch(deleteEventFromList(eventId));
        navigate('/user-dashboard');
        onClose();
      } else if ('error' in res && res.error) {
        setErrorMessage((res as any).error.data.message);
      }
    } catch (error) {
      setErrorMessage(t.deleteModal.errorDeleting);
    } finally {
      setIsDeleting(false);
    }
  }

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiAlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {t.deleteModal.deleteEvent}
                    </h2>
                    <p className="text-red-100 text-sm">{t.deleteModal.cannotBeUndone}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-xl transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Event Title */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t.deleteModal.deleteEventTitle.replace('{title}', eventTitle)}
                </h3>
                <p className="text-gray-600 mb-1">
                  {t.deleteModal.confirmDelete}
                </p>
                <p className="text-gray-500 text-sm">
                  {t.deleteModal.dataWillBeRemoved}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {t.deleteModal.friendsWillBeSad}
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <FiAlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.deleteModal.cancel}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      <span>{t.deleteModal.deleting}</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span>{t.deleteModal.deleteEvent}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default DeleteEvent;

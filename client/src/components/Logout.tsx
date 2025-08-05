import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeLogout } from '../reduxFiles/slices/logout';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiX, FiAlertTriangle } from 'react-icons/fi';
import { useGetMeQuery } from '../services/JamDB';
import { clearAuthData } from '../services/ApiResponseType';
import { RootState } from '../reduxFiles/store';

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogoutModalOpen = useSelector((state: RootState) => state.logoutReducer?.valueOf());
  const { data: userData, error } = useGetMeQuery(undefined, {
    skip: !isLogoutModalOpen
  });

  // Use useEffect to close the modal if not authenticated
  useEffect(() => {
    if (
      isLogoutModalOpen &&
      (!userData ||
        (error &&
          typeof error === 'object' &&
          'status' in error &&
          (error as { status?: number }).status === 401))
    ) {
      dispatch(closeLogout());
    }
  }, [userData, error, dispatch, isLogoutModalOpen]);

  // Only render if modal is open
  if (!isLogoutModalOpen) {
    return null;
  }

  const handleLogout = () => {
    // Use centralized auth data clearing
    clearAuthData();

    // Close modal
    dispatch(closeLogout());

    // Navigate to home
    navigate('/');

    // Reload to clear any cached state
    window.location.reload();
  };

  const handleCancel = () => {
    dispatch(closeLogout());
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md"
        >
          {/* Header */}
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Out</h2>
            <p className="text-gray-600">
              Are you sure you want to sign out of your account?
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <FiLogOut className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    Before you go
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Make sure you've saved any important changes. You'll need to
                    sign in again to access your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 group"
              >
                <FiX className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Cancel</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Logout;

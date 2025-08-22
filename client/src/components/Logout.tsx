import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeLogout } from '../reduxFiles/slices/logout';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiX, FiAlertTriangle } from 'react-icons/fi';
import { clearAuthData } from '../services/ApiResponseType';
import { RootState } from '../reduxFiles/store';
import { useClerk } from '@clerk/clerk-react';

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const isLogoutModalOpen = useSelector((state: RootState) => state.logoutReducer?.valueOf());
  // Removed user verification - just let anyone log out

  // Only render if modal is open
  if (!isLogoutModalOpen) {
    return null;
  }

  const handleLogout = async () => {
    try {
      // Sign out from Clerk first if available
      if (signOut) {
        await signOut();
      }
    } catch (error) {
      console.log('Clerk signOut error (non-critical):', error);
    }
    
    // Use centralized auth data clearing
    clearAuthData();

    // Close modal
    dispatch(closeLogout());

    // Navigate to home (React Router will handle this smoothly)
    navigate('/');
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
          className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={handleCancel}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md"
        >
          {/* Header */}
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign Out</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to sign out of your account?
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <FiLogOut className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Before you go
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
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
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all duration-200 group"
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

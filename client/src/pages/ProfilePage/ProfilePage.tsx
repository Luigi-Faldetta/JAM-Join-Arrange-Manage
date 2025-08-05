import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGetMeQuery, useUpdateUserMutation } from '../../services/JamDB';
import PictureUpload from '../../components/PictureUpload';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiSave,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiCamera,
  FiShield,
} from 'react-icons/fi';

export default function ProfilePage() {
  const { data: userData, isLoading } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (userData?.data) {
      setFormData((prev) => ({
        ...prev,
        name: userData.data.name || '',
        email: userData.data.email || '',
        phone: userData.data.phone || '',
      }));
    }
  }, [userData]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.newPassword));
  }, [formData.newPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setShowError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setShowError('New passwords do not match');
      return;
    }

    if (formData.newPassword && passwordStrength < 75) {
      setShowError('Password is too weak. Please use a stronger password.');
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const result = await updateUser(updateData);

      if ('data' in result && result.data.success) {
        setShowSuccess(true);
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setShowError('An error occurred while updating your profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <FiLoader className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  const user = userData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-center">
            <div className="relative inline-block">
              <img
                src={user?.profilePic || '/no-profile-picture-icon.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute bottom-2 right-2">
                <PictureUpload eventFile={null} setEventFile={() => {}} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">{user?.name}</h2>
            <p className="text-purple-100">{user?.email}</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Success/Error Messages */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2 text-green-700"
              >
                <FiCheck className="w-5 h-5" />
                <span>Profile updated successfully!</span>
              </motion.div>
            )}

            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700"
              >
                <FiAlertCircle className="w-5 h-5" />
                <span>{showError}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <FiUser className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center space-x-2 mb-6">
                  <FiShield className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Security
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter current password to change"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
                      />

                      {/* Password Strength Indicator */}
                      {formData.newPassword && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Password Strength</span>
                            <span>{passwordStrength}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength < 50
                                  ? 'bg-red-500'
                                  : passwordStrength < 75
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <motion.button
                  type="submit"
                  disabled={isUpdating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isUpdating ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiSave className="w-5 h-5" />
                  )}
                  <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

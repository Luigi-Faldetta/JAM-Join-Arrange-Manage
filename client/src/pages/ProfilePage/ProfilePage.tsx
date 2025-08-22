import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGetMeQuery, useUpdateUserMutation } from '../../services/JamDB';
import { useAppDispatch } from '../../reduxFiles/store';
import { openLogout } from '../../reduxFiles/slices/logout';
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiLoader,
  FiCheck,
  FiAlertCircle,
  FiShield,
  FiUploadCloud,
  FiArrowLeft,
  FiLogOut,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { data: userData, isLoading, refetch: refetchMe } = useGetMeQuery();
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [manualUserData, setManualUserData] = useState<any>(null);

  // Use manual data as fallback when RTK Query fails
  const user = userData?.data || manualUserData;

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Refetch user data on mount and add manual fallback
  useEffect(() => {
    refetchMe();
    
    // Manual API call as fallback
    const token = localStorage.getItem('token');
    if (token) {
      const cleanToken = token.replace(/["']/g, '').trim();
      // Use the same URL pattern as RTK Query
      const baseUrl = process.env.NODE_ENV !== 'production'
        ? process.env.REACT_APP_API_BASE_URL || 'http://localhost:3200/'
        : process.env.REACT_APP_API_BASE_URL || 'https://jam-join-arrange-manage-production.up.railway.app';
      
      const apiUrl = baseUrl.endsWith('/') ? `${baseUrl}me` : `${baseUrl}/me`;
      
      fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setManualUserData(data.data);
        }
      })
      .catch(err => {
        console.error('Manual fetch error:', err);
      });
    }
  }, [refetchMe]);

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

    if (!user?.userId) {
      setShowError(t.profile.userDataNotLoaded);
      // Try to refetch user data
      refetchMe();
      return;
    }

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setShowError(t.profile.passwordsDoNotMatch);
      return;
    }

    if (formData.newPassword && passwordStrength < 75) {
      setShowError(t.profile.passwordTooWeak);
      return;
    }

    try {
      const updateData: any = {};
      
      // Only include fields that have changed
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }
      
      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      
      if (formData.phone !== user?.phone) {
        updateData.phone = formData.phone;
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      // Don't make API call if nothing changed
      if (Object.keys(updateData).length === 0) {
        setShowError(t.profile.noChangesToSave);
        return;
      }

      const result = await updateUser({
        ...updateData,
        userId: user?.userId || '',
      });

      console.log('Form update result:', result);

      if ('error' in result) {
        console.error('Form update error:', result.error);
        // Check for specific error messages
        if ((result.error as any)?.status === 409) {
          const errorMessage = (result.error as any)?.data?.message;
          if (errorMessage === 'Email already exists') {
            setShowError(t.profile.emailAlreadyInUse);
          } else {
            setShowError(errorMessage || t.profile.updateError);
          }
        } else {
          setShowError(t.profile.updateError);
        }
      } else if ('data' in result && result.data.success) {
        setShowSuccess(true);
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(t.profile.updateError);
      }
    } catch (error) {
      setShowError(t.profile.generalError);
    }
  };

  const handleSignOut = () => {
    dispatch(openLogout());
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if user data is available
    if (!user?.userId) {
      console.error('User data not available:', user);
      setShowError(t.profile.userDataNotLoaded);
      // Try to refetch
      refetchMe();
      return;
    }

    console.log('Uploading image for user:', user.userId);
    setUploadingImage(true);
    setShowError('');

    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'tdzb6v4z'); // Cloudinary preset from PictureUpload component
      formData.append('cloud_name', 'de4bu4ijj'); // Cloudinary cloud name

      // Upload to Cloudinary
      const cloudinaryRes = await fetch(
        'https://api.cloudinary.com/v1_1/de4bu4ijj/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryRes.ok) {
        throw new Error(t.profile.uploadImageError);
      }

      const uploadedImage = await cloudinaryRes.json();
      console.log('Cloudinary upload successful:', uploadedImage.secure_url);

      // Update user profile with new image URL
      const updatePayload = {
        userId: user.userId,
        profilePic: uploadedImage.secure_url,
      };
      console.log('Updating user with payload:', updatePayload);
      
      const result = await updateUser(updatePayload);
      console.log('Update result:', result);

      if ('error' in result) {
        console.error('Update error:', result.error);
        // Check if it's a 409 conflict but the update was successful
        if ((result.error as any)?.status === 409) {
          // The image was likely saved, so show success
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          setShowError(t.profile.updateProfilePicError);
        }
      } else if ('data' in result && result.data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setShowError(t.profile.retryUpload);
    } finally {
      setUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <FiLoader className="w-6 h-6 animate-spin" />
          <span className="text-lg">{t.profile.loadingProfile}</span>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Top Navigation Buttons */}
      <div className="absolute top-4 left-4 z-50 mb-6 sm:mb-0">
        <button
          onClick={() => navigate('/user-dashboard')}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>{t.profile.backToDashboard}</span>
        </button>
      </div>
      
      <div className="absolute top-4 right-4 z-50 mb-6 sm:mb-0">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          <FiLogOut className="w-4 h-4" />
          <span>{t.nav.signOut}</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 sm:pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            {t.profile.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {t.profile.subtitle}
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
                alt={t.common.altText.profile}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                key={user?.profilePic} // Force re-render when profile pic changes
              />
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
                <span>{t.profile.profileUpdated}</span>
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
                    {t.profile.personalInfo}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.profile.fullName}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder={t.profile.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.profile.phoneNumber}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder={t.profile.phonePlaceholder}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.profile.emailAddress}
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder={t.profile.emailPlaceholder}
                    />
                  </div>
                </div>

                {/* Profile Picture Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.profile.profilePicture}
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={user?.profilePic || '/no-profile-picture-icon.png'}
                      alt="Current profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
                        uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingImage ? (
                        <FiLoader className="w-5 h-5 animate-spin" />
                      ) : (
                        <FiUploadCloud className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">
                        {uploadingImage ? t.profile.uploading : t.profile.uploadPhoto}
                      </span>
                    </label>
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {t.profile.photoInfo}
                  </p>
                </div>
              </div>

              {/* Security Section */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center space-x-2 mb-6">
                  <FiShield className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t.profile.security}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.profile.currentPassword}
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder={t.profile.currentPasswordPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.profile.newPassword}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder={t.profile.newPasswordPlaceholder}
                      />

                      {/* Password Strength Indicator */}
                      {formData.newPassword && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{t.profile.passwordStrength}</span>
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
                        {t.profile.confirmPassword}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder={t.profile.confirmPasswordPlaceholder}
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
                  <span>{isUpdating ? t.profile.saving : t.profile.saveChanges}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

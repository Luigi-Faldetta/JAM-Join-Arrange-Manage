import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { closeAuthModal, switchMode } from '../../reduxFiles/slices/authModal';
import { RootState } from '../../reduxFiles/store';
import { FiX, FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { useLogInMutation, useAddUserMutation } from '../../services/JamDB';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
}

function AuthModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, mode } = useSelector((state: RootState) => state.authModalReducer);

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Form refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const repeatPasswordInputRef = useRef<HTMLInputElement>(null);

  // API mutations
  const [loginUser] = useLogInMutation();
  const [createUser] = useAddUserMutation();

  const handleClose = () => {
    dispatch(closeAuthModal());
    setErrorMessage('');
    setSuccessMessage('');
    setPasswordMatch(true);
  };

  const handleSwitchMode = () => {
    const newMode = mode === 'signin' ? 'signup' : 'signin';
    dispatch(switchMode(newMode));
    setErrorMessage('');
    setSuccessMessage('');
    setPasswordMatch(true);
  };

  const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setPasswordMatch(true);

    const userFormData: LoginFormData = {
      email: emailInputRef.current?.value || '',
      password: passwordInputRef.current?.value || '',
    };

    try {
      const result = await loginUser(userFormData).unwrap();

      if (result.success && result.data) {
        localStorage.setItem('token', result.data);
        handleClose();
        navigate('/user-dashboard');
      } else {
        setPasswordMatch(false);
        setErrorMessage('Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      setPasswordMatch(false);
      setErrorMessage(error?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const password = passwordInputRef.current?.value || '';
    const repeatPassword = repeatPasswordInputRef.current?.value || '';

    if (password !== repeatPassword) {
      setPasswordMatch(false);
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const userFormData: CreateUserFormData = {
      name: nameInputRef.current?.value || '',
      email: emailInputRef.current?.value || '',
      password: password,
    };

    try {
      const result = await createUser(userFormData).unwrap();

      if (result.success) {
        setSuccessMessage('Account created successfully! Please sign in.');
        setTimeout(() => {
          dispatch(switchMode('signin'));
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage(result.message || 'Account creation failed. Please try again.');
      }
    } catch (error: any) {
      setErrorMessage(error?.data?.message || 'Account creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mode) return null;

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
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Error/Success Messages */}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={mode === 'signin' ? handleSignInSubmit : handleSignUpSubmit}>
              {/* Name field for signup */}
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={emailInputRef}
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      !passwordMatch ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Repeat password field for signup */}
              {mode === 'signup' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      ref={repeatPasswordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        !passwordMatch ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* Switch mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={handleSwitchMode}
                  className="ml-1 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AuthModal;
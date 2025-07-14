import React, { useState, useRef } from 'react';
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { useAddUserMutation } from '../../services/JamDB';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
}

function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const repeatPasswordInputRef = useRef<HTMLInputElement>(null);

  const [createUser] = useAddUserMutation();
  const navigate = useNavigate();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const password = passwordInputRef.current?.value || '';
    const repeatPassword = repeatPasswordInputRef.current?.value || '';

    if (password !== repeatPassword) {
      setPasswordMatch(false);
      setErrorMessage('Passwords do not match. Please try again.');
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
        setSuccessMessage(
          'Account created successfully! Please check your email to verify your account.'
        );
        setPasswordMatch(true);

        // Reset form
        if (nameInputRef.current) nameInputRef.current.value = '';
        if (emailInputRef.current) emailInputRef.current.value = '';
        if (passwordInputRef.current) passwordInputRef.current.value = '';
        if (repeatPasswordInputRef.current)
          repeatPasswordInputRef.current.value = '';

        // Close modal after 2 seconds
        setTimeout(() => {
          setOpen(false);
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage(
          result.message || 'Registration failed. Please try again.'
        );
      }
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number): string => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const handleModalClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
    setPasswordMatch(true);
  };

  return (
    <div className="space-y-4">
      {/* Sign up prompt */}
      <div
        className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-0 animate-fadeIn"
        style={{ animationDelay: '0.6s' }}
      >
        <p className="text-gray-600 mb-3">Don't have an account yet?</p>
        <button
          onClick={() => setOpen(true)}
          className="w-full px-4 py-2 border border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-lg transition-all duration-200"
        >
          Create your account
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={handleModalClose}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="p-3 border border-green-200 bg-green-50 rounded-lg flex items-center space-x-2">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    ref={nameInputRef}
                    placeholder="Enter your full name"
                    className="w-full pl-10 h-12 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-email"
                    type="email"
                    ref={emailInputRef}
                    placeholder="Enter your email"
                    className="w-full pl-10 h-12 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    ref={passwordInputRef}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-10 h-12 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                          level <= passwordStrength
                            ? getStrengthColor(passwordStrength)
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength:{' '}
                    <span className="font-medium">
                      {getStrengthText(passwordStrength)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    ref={repeatPasswordInputRef}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 h-12 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {(!passwordMatch || errorMessage) && (
                <div className="p-3 border border-red-200 bg-red-50 rounded-lg flex items-center space-x-2">
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 text-sm">
                    {errorMessage ||
                      'Passwords do not match. Please try again.'}
                  </p>
                </div>
              )}

              {/* Terms and Privacy */}
              <div className="text-xs text-gray-600 text-center">
                By creating an account, you agree to our{' '}
                <Link
                  to="/terms"
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Privacy Policy
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Account</span>
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default CreateUserForm;

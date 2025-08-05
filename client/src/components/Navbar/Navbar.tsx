import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link as Scroll } from 'react-scroll';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiMessageCircle,
  FiGrid,
  FiStar,
} from 'react-icons/fi';
import { useIsLoggedIn } from '../../utils/useIsLoggedIn';
import { useGetMeQuery } from '../../services/JamDB';
import { useAppDispatch } from '../../reduxFiles/store';
import { openLogout } from '../../reduxFiles/slices/logout';
import { openAuthModal } from '../../reduxFiles/slices/authModal';

// Types
interface NavItem {
  name: string;
  to: string;
  offset: number;
}

interface UserData {
  profilePic?: string;
  name?: string;
}

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { isLoggedIn } = useIsLoggedIn();
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Replace the old useGetUserQuery with useGetMeQuery
  const { data } = useGetMeQuery(undefined, {
    skip: !isLoggedIn,
  }) as { data?: { data: UserData } };
  const userData = data?.data;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { name: 'Home', to: 'hero', offset: -190 },
    { name: 'About', to: 'about', offset: -72 },
    { name: 'FAQs', to: 'faqs', offset: -100 },
    { name: 'Get in touch', to: 'contact', offset: -100 },
  ];

  const handleSignOut = () => {
    dispatch(openLogout());
    setShowDropdown(false);
  };

  const handleSignInClick = () => {
    dispatch(openAuthModal('signin'));
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  // Define routes where navbar should be hidden when logged in
  const protectedRoutes = [
    '/user-dashboard',
    '/profile',
    '/event', // Added event dashboard route
    '/sso-callback',
  ];

  // Check if current route is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Hide navbar if user is logged in and on a protected route
  if (isLoggedIn && isProtectedRoute) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg shadow-gray-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/jam-strw.png"
                alt="JAM Logo"
                className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                JAM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name}>
                <Scroll
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={item.offset}
                  duration={500}
                  className="relative px-4 py-2 text-gray-700 hover:text-purple-600 font-medium cursor-pointer transition-colors duration-200 group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Scroll>
              </div>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/user-dashboard">
                  <button className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors duration-200">
                    <FiGrid className="w-4 h-4 mr-2" />
                    Dashboard
                  </button>
                </Link>

                <button className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                  <FiMessageCircle className="w-4 h-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={handleDropdownToggle}
                    className="relative h-10 w-10 rounded-full ring-2 ring-purple-100 hover:ring-purple-200 transition-all duration-200 overflow-hidden"
                  >
                    <img
                      src={
                        userData?.profilePic || '/no-profile-picture-icon.png'
                      }
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiUser className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <button 
                  onClick={handleSignInClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              {showMobileMenu ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                <Scroll
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={item.offset}
                  duration={500}
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium cursor-pointer transition-all duration-200"
                >
                  {item.name}
                </Scroll>
              </div>
            ))}

            {isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/user-dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200"
                >
                  <FiGrid className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200"
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}

            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    handleSignInClick();
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

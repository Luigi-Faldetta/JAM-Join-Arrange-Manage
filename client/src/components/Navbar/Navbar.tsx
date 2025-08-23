import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAppDispatch } from '../../reduxFiles/store';
import { openAuthModal } from '../../reduxFiles/slices/authModal';

// Types
interface NavItem {
  name: string;
  to: string;
  offset: number;
}

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const location = useLocation();

  // Handle scroll effect (must be called before any conditional returns)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show navbar on landing page (root path)
  if (location.pathname !== '/') {
    return null;
  }

  const navItems: NavItem[] = [
    { name: 'Home', to: 'hero', offset: -190 },
    { name: 'About', to: 'about', offset: -72 },
    { name: 'FAQs', to: 'faq', offset: -80 },
    { name: 'Get in touch', to: 'contact', offset: -80 },
  ];

  // Custom scroll handler to fix offset issues
  const handleScrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    const navItem = navItems.find((item) => item.to === targetId);

    if (element && navItem) {
      const offsetTop = element.offsetTop + navItem.offset; // Use individual offset values
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleSignInClick = () => {
    dispatch(openAuthModal('signin'));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 relative">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/jam-strw.png"
                alt="JAM Logo"
                className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                JAM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => handleScrollToSection(item.to)}
                  className="relative px-4 py-2 text-gray-900 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium cursor-pointer transition-colors duration-200 group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleSignInClick}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-900 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
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
        <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => {
                    handleScrollToSection(item.to);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-900 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg font-medium cursor-pointer transition-all duration-200"
                >
                  {item.name}
                </button>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link as Scroll } from 'react-scroll';
import { useIsLoggedIn } from '../../utils/useIsLoggedIn';

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', to: 'hero', offset: -190 },
    { name: 'About', to: 'about', offset: -72 },
    { name: 'FAQs', to: 'faqs', offset: -100 },
  ];

  if (isLoggedIn && location.pathname.startsWith('/user-dashboard')) {
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

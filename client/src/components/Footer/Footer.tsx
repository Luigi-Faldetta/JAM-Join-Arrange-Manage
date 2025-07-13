import React from 'react';
import { FiMail, FiLinkedin, FiHeart, FiStar } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  color: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/contactus');
  };

  const socialLinks: SocialLink[] = [
    {
      icon: FiMail,
      href: '/contactus',
      label: 'Contact us',
      color: 'hover:text-purple-600',
      onClick: handleContactClick,
    },
    {
      icon: FiLinkedin,
      href: 'https://www.linkedin.com/company/96443199/admin/feed/posts/',
      label: 'LinkedIn',
      color: 'hover:text-blue-600',
      external: true,
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 to-white border-t border-gray-200/50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img
              src="/jam-strw.png"
              alt="JAM Logo"
              className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
            <div className="text-left">
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                JAM
              </h3>
              <p className="text-sm text-gray-500">Join. Arrange. Manage.</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">© {currentYear} JAM. Made with</span>
            <FiHeart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-sm">All rights reserved</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-2">
            {socialLinks.map((link, index) => (
              <div
                key={link.label}
                className="transform hover:scale-110 transition-transform duration-200"
              >
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 ${link.color} hover:bg-gray-100 transition-all duration-200`}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    onClick={link.onClick}
                    aria-label={link.label}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 ${link.color} hover:bg-gray-100 transition-all duration-200`}
                  >
                    <link.icon className="w-5 h-5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section with additional links */}
        <div className="mt-8 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Link
                to="/privacy"
                className="hover:text-purple-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-purple-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/support"
                className="hover:text-purple-600 transition-colors duration-200"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

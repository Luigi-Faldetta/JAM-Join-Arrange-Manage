import React, { useState, useEffect } from 'react';
import {
  FiArrowRight,
  FiPlay,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiStar,
} from 'react-icons/fi';
import LoginForm from './LoginForm';
import CreateUserForm from './CreateUserForm';
import { useIsLoggedIn } from '../../utils/useIsLoggedIn';

interface EventData {
  data: {
    title: string;
    // Add other event properties as needed
  };
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  color: string;
}

interface Stat {
  number: string;
  label: string;
}

interface ModernLandingHeroProps {
  eventData?: EventData;
}

function ModernLandingHero({ eventData }: ModernLandingHeroProps) {
  const [loginFormActive, setLoginFormActive] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const isLoggedIn = useIsLoggedIn();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features: Feature[] = [
    { icon: FiUsers, text: 'Team Collaboration', color: 'text-blue-500' },
    { icon: FiCalendar, text: 'Event Planning', color: 'text-green-500' },
    { icon: FiDollarSign, text: 'Bill Splitting', color: 'text-purple-500' },
  ];

  const stats: Stat[] = [
    { number: '10K+', label: 'Events Created' },
    { number: '50K+', label: 'Happy Users' },
    { number: '99.9%', label: 'Uptime' },
  ];

  const handleGetStartedClick = () => {
    setLoginFormActive(!loginFormActive);
  };

  // Calculate parallax values
  const backgroundY = scrollY * 0.3;
  const opacity = Math.max(1 - scrollY / 300, 0);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50"
      id="hero"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          style={{ transform: `translateY(${backgroundY}px)` }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 transition-transform duration-100"
        />
        <div
          style={{ transform: `translateY(${-backgroundY * 0.5}px)` }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 transition-transform duration-100"
        />
        <div
          style={{ transform: `translateY(${backgroundY * 0.25}px)` }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-20 transition-transform duration-100"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left opacity-0 animate-fadeInUp">
            {/* Badge */}
            <div className="inline-flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                <FiStar className="w-4 h-4 mr-2" />
                New: AI-Powered Event Planning
              </div>
            </div>

            {/* Main Heading */}
            {eventData ? (
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  You're invited to{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    {eventData?.data.title}
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
                  Ready to join? Please log in.
                </h2>
              </div>
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Join. Arrange. Manage.
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Everything.
                </span>
              </h1>
            )}

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              From splitting bills and organizing todos to planning
              unforgettable events. The all-in-one platform that brings people
              together.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={feature.text}
                  className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleGetStartedClick}
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Get Started Free
                  <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium border border-gray-300 hover:border-purple-300 hover:bg-purple-50 text-gray-700 rounded-lg transition-all duration-200 group">
                  <FiPlay className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Watch Demo
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Forms or Image */}
          <div
            className="relative opacity-0 animate-fadeInUp"
            style={{ animationDelay: '0.2s' }}
          >
            {!isLoggedIn ? (
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div
                    className={`transition-all duration-500 ${
                      loginFormActive ? 'block' : 'hidden'
                    }`}
                  >
                    <LoginForm />
                  </div>
                  <div
                    className={`transition-all duration-500 ${
                      !loginFormActive ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                        <FiStar className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Ready to get started?
                        </h3>
                        <p className="text-gray-600">
                          Join thousands of users who trust JAM for their
                          events.
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          4.9/5 from 2,000+ reviews
                        </span>
                      </div>
                    </div>
                    <CreateUserForm />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
                <img
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Team collaboration"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-100"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center animate-bounce">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default ModernLandingHero;

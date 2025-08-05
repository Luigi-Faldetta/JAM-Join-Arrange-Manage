import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi';
import {
  AnimatedCounter,
  RippleButton,
  ParticleBackground,
  FloatingScrollToTop,
} from '../../components/InteractiveElements/InteractiveElements';

// A helper hook to detect when an element is in the viewport
const useInView = (options: IntersectionObserverInit = { threshold: 0.2 }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isInView] as const;
};

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
}

interface Stat {
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function LandingAbout() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  const [headerRef, isHeaderInView] = useInView();
  const [mainContentRef, isMainContentInView] = useInView();
  const [featuresRef, isFeaturesInView] = useInView();
  const [billSplittingRef, isBillSplittingInView] = useInView();
  const [statsRef, isStatsInView] = useInView();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features: Feature[] = [
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Seamlessly coordinate with your team members and friends',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: FiCalendar,
      title: 'Event Planning',
      description: 'Create and manage events with powerful planning tools',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: FiDollarSign,
      title: 'Smart Bill Splitting',
      description: 'Automatically calculate and split expenses fairly',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  const benefits = [
    'Real-time collaboration',
    'Automated calculations',
    'Mobile-first design',
    'Secure data handling',
    '24/7 support',
    'Free to get started',
  ];

  const stats: Stat[] = [
    { number: '10000+', label: 'Events Created', icon: FiCalendar },
    { number: '50000+', label: 'Happy Users', icon: FiUsers },
    { number: '$2M+', label: 'Bills Split', icon: FiDollarSign },
    { number: '99.9%', label: 'Uptime', icon: FiCheckCircle },
  ];

  const parallaxY = scrollY * 0.1;

  const handleLearnMoreClick = () => navigate('/features');

  const renderStat = (stat: Stat) => {
    const numberMatch = stat.number.match(/[\d.]+/);
    const number = numberMatch ? parseFloat(numberMatch[0]) : 0;
    const prefix = stat.number.startsWith('$') ? '$' : '';
    const suffix = stat.number.replace(/[\d,.]+/g, '').replace('$', '');

    return (
      <>
        {prefix}
        {isStatsInView && <AnimatedCounter target={number} duration={2000} />}
        {suffix}
      </>
    );
  };

  return (
    <section
      className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden"
      id="about"
    >
      <ParticleBackground />
      <FloatingScrollToTop />

      <div className="absolute inset-0">
        <div
          style={{ transform: `translateY(${parallaxY}px)` }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 transition-transform duration-100"
        />
        <div
          style={{ transform: `translateY(${-parallaxY * 0.5}px)` }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 transition-transform duration-100"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-700 ease-out ${
            isHeaderInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 px-4 py-2 rounded-full text-sm font-medium">
            <FiStar className="w-4 h-4 mr-2" />
            About JAM
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Everything you need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              organize amazing events
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            JAM is the all-in-one platform that brings people together. From
            planning events to splitting bills and managing tasks, we make
            collaboration effortless.
          </p>
        </div>

        <div
          ref={mainContentRef}
          className="grid lg:grid-cols-2 gap-16 items-center mb-20"
        >
          <div
            className={`space-y-8 transition-all duration-700 ease-out ${
              isMainContentInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Streamline your event organization
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                JAM - Join, Arrange, Manage - is designed to make event planning
                effortless. Whether you're organizing a small gathering or a
                large celebration, our platform provides all the tools you need
                in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className={`flex items-center space-x-2 transition-all duration-500 ease-out ${
                    isMainContentInView ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            <RippleButton onClick={handleLearnMoreClick}>
              <div className="flex items-center">
                Learn More
                <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </RippleButton>
          </div>
          <div
            className={`relative transition-all duration-700 ease-out ${
              isMainContentInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
            <img
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Team collaboration"
            />
          </div>
        </div>

        <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`relative group hover:transform hover:-translate-y-1 transition-all duration-500 ease-out ${
                isFeaturesInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div
                className={`relative ${feature.bgColor} rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={billSplittingRef}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div
            className={`relative order-2 lg:order-1 transition-all duration-700 ease-out ${
              isBillSplittingInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-20"></div>
            <img
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Bill splitting"
            />
          </div>
          <div
            className={`space-y-6 order-1 lg:order-2 transition-all duration-700 ease-out ${
              isBillSplittingInView
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Smart bill splitting made simple
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                No more awkward conversations about money. JAM automatically
                calculates fair splits, tracks who owes what, and sends gentle
                reminders. Focus on enjoying your time together, not on the
                math.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">
                    Automatic calculations
                  </h5>
                  <p className="text-gray-600">
                    Smart algorithms ensure fair distribution of costs
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">
                    Real-time tracking
                  </h5>
                  <p className="text-gray-600">
                    See who's paid and who still owes instantly
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">
                    Gentle reminders
                  </h5>
                  <p className="text-gray-600">
                    Automated notifications keep everyone on track
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={statsRef}
          className={`mt-24 pt-16 border-t border-gray-200 transition-all duration-700 ease-out ${
            isStatsInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by thousands worldwide
            </h3>
            <p className="text-lg text-gray-600">
              Join the growing community of event organizers who love JAM
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center hover:transform hover:scale-105 transition-all duration-500 ease-out ${
                  isStatsInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {renderStat(stat)}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingAbout;

import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../../reduxFiles/slices/authModal';
import FloatingParticles from '../../components/UI/FloatingParticles';

interface LandingHeroProps {
  eventData?: any; // Keep this in case you use it later
}

const LandingHero: React.FC<LandingHeroProps> = ({ eventData }) => {
  const dispatch = useDispatch();

  const handleGetStartedClick = () => {
    // Open signup modal instead of navigating
    dispatch(openAuthModal('signup'));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <FloatingParticles particleCount={10} />
      </div>

      <div className="relative max-w-4xl mx-auto w-full z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
        >
          <span className="block">Organize Events Effortlessly with</span>
          <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mt-2">
            JAM: Join, Arrange, Manage
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed"
        >
          The all-in-one platform for seamless event planning, team
          collaboration, and smart bill splitting. Focus on the fun, we'll
          handle the rest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <button 
            onClick={handleGetStartedClick}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Get Started for Free
            <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingHero;

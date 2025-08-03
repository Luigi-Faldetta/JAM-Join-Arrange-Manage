import React from 'react';
import { motion } from 'framer-motion';
import LandingHero from '../LandingHero/LandingHero';
import LandingAbout from '../LandingAbout/LandingAbout';
import LandingFaqs from '../LandingFaqs/LandingFaqs';
import ContactUs from '../ContactUs/ContactUs';

interface LandingPageProps {
  eventData?: any;
}

export default function LandingPage({ eventData }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        id="hero"
        className="min-h-screen"
      >
        <LandingHero eventData={eventData} />
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="about"
      >
        <LandingAbout />
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="faq"
      >
        <LandingFaqs />
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="contact"
      >
        <ContactUs />
      </motion.section>
    </div>
  );
}

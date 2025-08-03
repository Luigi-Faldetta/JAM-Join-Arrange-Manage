import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'What is JAM and how does it work?',
    answer:
      'JAM is a comprehensive event management platform that helps you create, organize, and manage events effortlessly. Simply create an account, set up your event with all the details, and invite your friends. JAM handles everything from RSVPs to expense tracking and task management.',
  },
  {
    id: 2,
    question: 'Is JAM free to use?',
    answer:
      'Yes! JAM offers a free tier that includes all basic event management features. You can create events, invite attendees, track expenses, and manage tasks without any cost. We also offer premium features for users who need advanced functionality.',
  },
  {
    id: 3,
    question: 'How do I invite people to my event?',
    answer:
      "Inviting people is super easy! Once you create an event, you'll get a unique event link that you can share via email, social media, or messaging apps. People can join your event by simply clicking the link and creating a free account.",
  },
  {
    id: 4,
    question: 'Can I track expenses for my event?',
    answer:
      'Absolutely! JAM includes a built-in expense tracking system. You can add expenses, see who paid for what, and even split costs among attendees. This makes it easy to keep track of event budgets and settle up afterwards.',
  },
  {
    id: 5,
    question: 'What types of events can I create?',
    answer:
      "JAM is perfect for any type of event! Whether it's a birthday party, wedding, corporate meeting, conference, casual hangout, or any other gathering, JAM provides the tools you need to organize it successfully.",
  },
  {
    id: 6,
    question: 'Is my data secure on JAM?',
    answer:
      'Yes, we take security seriously. All your data is encrypted and stored securely. We follow industry best practices for data protection and never share your personal information with third parties without your consent.',
  },
  {
    id: 7,
    question: 'Can I use JAM on my mobile device?',
    answer:
      'Yes! JAM is fully responsive and works great on all devices - desktop, tablet, and mobile. You can manage your events on the go, check RSVPs, add expenses, and communicate with attendees from anywhere.',
  },
  {
    id: 8,
    question: 'How do I get support if I need help?',
    answer:
      "We're here to help! You can reach out to our support team through the contact form on our website, or email us directly. We typically respond within 24 hours and are always happy to assist with any questions or issues.",
  },
];

export default function LandingFaqs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faqs" className="pt-24 pb-0 -mb-1 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FiHelpCircle className="w-8 h-8 text-purple-600" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Got questions? We've got answers! Here are the most common questions
          about JAM.
        </p>
      </motion.div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                {faq.question}
              </h3>
              <motion.div
                animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <FiChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openFaq === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6 pt-2">
                    <div className="w-full h-px bg-gradient-to-r from-purple-200 to-pink-200 mb-4"></div>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center mt-16 mb-16"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our friendly support team
            is here to help you get the most out of JAM.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              contactSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact Support
          </motion.button>
        </div>
      </motion.div>
      </div>
    </section>
  );
}

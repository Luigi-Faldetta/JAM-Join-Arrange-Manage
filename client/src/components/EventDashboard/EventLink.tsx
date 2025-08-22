import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import {
  FiShare2,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiMail,
  FiMessageCircle,
  FiTwitter,
  FiFacebook,
} from 'react-icons/fi';

interface EventLinkProps {
  eventid: string | undefined;
}

export default function EventLink({ eventid }: EventLinkProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const eventUrl = `${window.location.origin}/event/${eventid}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = eventUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: t.shareModal.copyLink,
      icon: FiCopy,
      action: handleCopyLink,
      color: 'from-gray-600 to-gray-700',
      hoverColor: 'hover:from-gray-700 hover:to-gray-800',
    },
    {
      name: t.shareModal.email,
      icon: FiMail,
      action: () =>
        window.open(
          `mailto:?subject=${t.shareModal.joinMyEvent}&body=${t.shareModal.checkOutThisEvent}: ${eventUrl}`
        ),
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
    },
    {
      name: t.shareModal.whatsapp,
      icon: FiMessageCircle,
      action: () =>
        window.open(`https://wa.me/?text=${t.shareModal.checkOutThisEvent}: ${eventUrl}`),
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800',
    },
    {
      name: t.shareModal.twitter,
      icon: FiTwitter,
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${t.shareModal.checkOutThisEvent}: ${eventUrl}`
        ),
      color: 'from-sky-600 to-sky-700',
      hoverColor: 'hover:from-sky-700 hover:to-sky-800',
    },
    {
      name: t.shareModal.facebook,
      icon: FiFacebook,
      action: () =>
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`),
      color: 'from-indigo-600 to-indigo-700',
      hoverColor: 'hover:from-indigo-700 hover:to-indigo-800',
    },
  ];

  return (
    <div className="relative">
      {/* Main Share Button */}
      <motion.button
        onClick={() => setShowShareMenu(!showShareMenu)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <FiShare2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span>{t.shareModal.shareEvent}</span>
        <FiExternalLink className="w-3 h-3 opacity-70" />
      </motion.button>

      {/* Share Menu */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowShareMenu(false)}
            />

            {/* Share Options */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 right-0 mb-2 z-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t.shareModal.shareThisEvent}
                  </h3>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <input
                      type="text"
                      value={eventUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      title={t.shareModal.copyLinkTitle}
                    >
                      {copied ? (
                        <FiCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <FiCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {shareOptions.map((option, index) => (
                    <motion.button
                      key={option.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => {
                        option.action();
                        setShowShareMenu(false);
                      }}
                      className={`flex items-center space-x-2 p-3 bg-gradient-to-r ${option.color} ${option.hoverColor} text-white rounded-xl transition-all duration-200 group`}
                    >
                      <option.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm font-medium">{option.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Copy Success Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            {t.shareModal.linkCopied}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

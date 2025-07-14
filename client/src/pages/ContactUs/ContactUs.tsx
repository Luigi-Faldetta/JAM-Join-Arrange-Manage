import React, { useState } from 'react';
import {
  FiMail,
  FiSend,
  FiMessageCircle,
  FiPhone,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiStar,
} from 'react-icons/fi';

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  value: string;
  color: string;
}

interface OfficeInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}

function ContactUs() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');
      setMessage('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 2000);
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: FiMail,
      title: 'Email us',
      description: 'Get in touch via email',
      value: 'hello@jam.com',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FiMessageCircle,
      title: 'Live chat',
      description: 'Chat with our team',
      value: 'Available 24/7',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FiPhone,
      title: 'Call us',
      description: 'Speak with support',
      value: '+1 (555) 123-4567',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const officeInfo: OfficeInfo[] = [
    {
      icon: FiMapPin,
      title: 'Office',
      value: '123 Innovation Street\nSan Francisco, CA 94105',
    },
    {
      icon: FiClock,
      title: 'Hours',
      value: 'Monday - Friday\n9:00 AM - 6:00 PM PST',
    },
  ];

  return (
    <section className="relative min-h-screen py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-fadeInUp">
          <div className="inline-flex items-center mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 px-4 py-2 rounded-full text-sm font-medium">
            <FiStar className="w-4 h-4 mr-2" />
            Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Get in touch with
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              our team
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about JAM? We're here to help. Send us a message and
            we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div
            className="relative opacity-0 animate-fadeInLeft"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-3 border border-green-200 bg-green-50 rounded-lg flex items-center space-x-2 opacity-0 animate-scaleIn">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700 text-sm">
                    Thank you for your message! We'll get back to you within 24
                    hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className="space-y-2 opacity-0 animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 h-12 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div
                  className="space-y-2 opacity-0 animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you..."
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                    required
                  />
                </div>

                <div
                  className="opacity-0 animate-fadeInUp"
                  style={{ animationDelay: '0.5s' }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FiSend className="w-5 h-5" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  By submitting this form, you agree to our{' '}
                  <a
                    href="/privacy"
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div
            className="space-y-8 opacity-0 animate-fadeInRight"
            style={{ animationDelay: '0.4s' }}
          >
            {/* Contact Methods */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Other ways to reach us
              </h3>
              {contactInfo.map((info, index) => (
                <div
                  key={info.title}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer hover:transform hover:scale-105 opacity-0 animate-fadeInUp"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                        {info.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-1">
                        {info.description}
                      </p>
                      <p className="font-medium text-gray-900">{info.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Information */}
            <div
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 opacity-0 animate-fadeInUp"
              style={{ animationDelay: '0.7s' }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Visit our office
              </h3>
              <div className="space-y-6">
                {officeInfo.map((info, index) => (
                  <div
                    key={info.title}
                    className="flex items-start space-x-3 opacity-0 animate-fadeInUp"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      <p className="text-gray-600 whitespace-pre-line">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 opacity-0 animate-fadeInUp"
              style={{ animationDelay: '1s' }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiClock className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Quick Response</h4>
                <p className="text-gray-600 text-sm">
                  We typically respond to all inquiries within 24 hours during
                  business days.
                </p>
              </div>
            </div>
          </div>
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default ContactUs;

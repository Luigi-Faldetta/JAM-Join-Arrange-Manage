import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const LandingAbout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Animated Counter Component
  const AnimatedCounter: React.FC<{
    value: number;
    prefix?: string;
    suffix?: string;
    format?: string;
    decimals?: number;
    duration?: number;
  }> = ({ value, prefix = "", suffix = "", format, decimals = 0, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const counterRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(counterRef, { once: true, margin: "-100px" });

    useEffect(() => {
      if (!isInView) return;

      let startTime: number;
      let animationId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = value * easeOutCubic;
        
        setCount(currentValue);

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animationId = requestAnimationFrame(animate);

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [isInView, value, duration]);

    const formatNumber = (num: number) => {
      if (format === "currency" && num >= 1000000) {
        return (num / 1000000).toFixed(decimals) + "M";
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(decimals) + "K";
      }
      return num.toFixed(decimals);
    };

    return (
      <div ref={counterRef} className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
        {prefix}{formatNumber(count)}{suffix}
      </div>
    );
  };

  const features = [
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly coordinate with your team members and friends",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Create and manage events with powerful planning tools",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: DollarSign,
      title: "Smart Bill Splitting",
      description: "Automatically calculate and split expenses fairly",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const benefits = [
    "Real-time collaboration",
    "Automated calculations",
    "Mobile-first design",
    "Secure data handling",
    "24/7 support",
    "Free to get started"
  ];

  const stats = [
    { 
      number: "10,000+", 
      value: 10000, 
      prefix: "", 
      suffix: "+", 
      label: "Events Created", 
      icon: Calendar 
    },
    { 
      number: "50,000+", 
      value: 50000, 
      prefix: "", 
      suffix: "+", 
      label: "Happy Users", 
      icon: Users 
    },
    { 
      number: "$2M+", 
      value: 2000000, 
      prefix: "$", 
      suffix: "+", 
      label: "Bills Split", 
      icon: DollarSign,
      format: "currency"
    },
    { 
      number: "99.9%", 
      value: 99.9, 
      prefix: "", 
      suffix: "%", 
      label: "Uptime", 
      icon: CheckCircle,
      decimals: 1
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative pt-24 pb-0 -mb-1 bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden" 
      id="about"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          style={{ y }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
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
            JAM is the all-in-one platform that brings people together. From planning events 
            to splitting bills and managing tasks, we make collaboration effortless.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Streamline your event organization
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                JAM - Join, Arrange, Manage - is designed to make event planning effortless. 
                Whether you're organizing a small gathering or a large celebration, our platform 
                provides all the tools you need in one place.
              </p>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              Learn More
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
            <img
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Team collaboration"
            />
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className={`relative ${feature.bgColor} rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bill Splitting Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur opacity-20"></div>
            <img
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Bill splitting"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 order-1 lg:order-2"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Smart bill splitting made simple
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                No more awkward conversations about money. JAM automatically calculates 
                fair splits, tracks who owes what, and sends gentle reminders. Focus on 
                enjoying your time together, not on the math.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Automatic calculations</h5>
                  <p className="text-gray-600">Smart algorithms ensure fair distribution of costs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Real-time tracking</h5>
                  <p className="text-gray-600">See who's paid and who still owes instantly</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Gentle reminders</h5>
                  <p className="text-gray-600">Automated notifications keep everyone on track</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 pt-16 pb-16 border-t border-gray-200"
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
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  format={stat.format}
                  decimals={stat.decimals}
                  duration={2000 + index * 200} // Stagger the animations
                />
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingAbout;
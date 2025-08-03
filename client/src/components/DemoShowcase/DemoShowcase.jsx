import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Zap,
  Heart,
  Star,
  MousePointer,
  Code,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FloatingScrollToTop,
  InteractiveLikeButton,
  InteractiveStarRating,
  AnimatedCounter,
  ThemeToggle,
  SoundToggle,
  MagneticButton,
  RippleButton,
  MouseFollower,
} from './InteractiveElements';

function DemoShowcase() {
  const features = [
    {
      icon: Palette,
      title: 'Modern Design System',
      description:
        'Contemporary aesthetics with clean typography and consistent visual hierarchy',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Smooth Animations',
      description: 'Framer Motion powered animations and micro-interactions',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: MousePointer,
      title: 'Interactive Elements',
      description:
        'Hover effects, click animations, and engaging user interactions',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Layers,
      title: 'Component Library',
      description:
        'Built with shadcn/ui and Radix UI for accessibility and consistency',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const interactiveComponents = [
    {
      title: 'Like Button',
      description: 'Animated like button with heart animation',
      component: <InteractiveLikeButton />,
    },
    {
      title: 'Star Rating',
      description: 'Interactive 5-star rating system',
      component: <InteractiveStarRating />,
    },
    {
      title: 'Theme Toggle',
      description: 'Smooth theme switching animation',
      component: <ThemeToggle />,
    },
    {
      title: 'Sound Toggle',
      description: 'Audio control with icon transitions',
      component: <SoundToggle />,
    },
  ];

  const stats = [
    { label: 'Components', value: 15, icon: Layers },
    { label: 'Animations', value: 50, icon: Zap },
    { label: 'Interactions', value: 25, icon: MousePointer },
    { label: 'Design Tokens', value: 100, icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-24">
      <MouseFollower />
      <FloatingScrollToTop />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge
            variant="secondary"
            className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Modern UI Showcase
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Redesigned JAM
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Components
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A complete redesign featuring modern aesthetics, smooth animations,
            and interactive elements built with React, Tailwind CSS, and Framer
            Motion.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">
                <AnimatedCounter target={stat.value} />
                <span className="text-purple-600">+</span>
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Components Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interactive Components
            </h2>
            <p className="text-lg text-gray-600">
              Try out these interactive elements with smooth animations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interactiveComponents.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              >
                <Card className="text-center p-6 border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    {item.component}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Button Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Button Effects
            </h2>
            <p className="text-lg text-gray-600">
              Buttons with magnetic and ripple effects
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <MagneticButton>Magnetic Button</MagneticButton>

            <RippleButton>Ripple Effect</RippleButton>

            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Standard Button
            </Button>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto border-gray-200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Modern Tech Stack</CardTitle>
              <CardDescription>
                Built with the latest technologies for optimal performance and
                developer experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">
                    React 19
                  </div>
                  <div className="text-gray-600">Latest React features</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">
                    Tailwind CSS
                  </div>
                  <div className="text-gray-600">Utility-first styling</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">
                    Framer Motion
                  </div>
                  <div className="text-gray-600">Smooth animations</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-1">
                    shadcn/ui
                  </div>
                  <div className="text-gray-600">Accessible components</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default DemoShowcase;

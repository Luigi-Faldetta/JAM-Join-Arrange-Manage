import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Star,
  Zap,
  ArrowUp,
  MousePointer,
  Palette,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '../UI/Button';

// Floating Action Button with scroll to top
export function FloatingScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <ArrowUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Interactive Particle Background
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 10,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [particle.x, particle.x + 100, particle.x - 100, particle.x],
            y: [particle.y, particle.y - 100, particle.y + 100, particle.y],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Interactive Like Button
export function InteractiveLikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const controls = useAnimation();

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    await controls.start({
      scale: [1, 1.3, 1],
      transition: { duration: 0.3 },
    });
  };

  return (
    <motion.button
      animate={controls}
      onClick={handleLike}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isLiked
          ? 'bg-red-100 text-red-600 border-2 border-red-200'
          : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
      }`}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-300 ${
          isLiked ? 'fill-current scale-110' : ''
        }`}
      />
      <span className="font-medium">{likeCount}</span>
    </motion.button>
  );
}

// Interactive Star Rating
export function InteractiveStarRating() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-all duration-200 ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </motion.button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 && `${rating}/5`}
      </span>
    </div>
  );
}

// Animated Counter
type AnimatedCounterProps = {
  target: number;
  duration?: number;
};

export function AnimatedCounter({
  target,
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
    >
      {count.toLocaleString()}
    </motion.span>
  );
}

// Interactive Theme Toggle
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you'd update the theme context here
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
        isDark ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <motion.div
        animate={{ x: isDark ? 32 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        {isDark ? (
          <Sparkles className="w-3 h-3 text-purple-600" />
        ) : (
          <Palette className="w-3 h-3 text-gray-600" />
        )}
      </motion.div>
    </motion.button>
  );
}

// Sound Toggle Button
export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    // In a real app, you'd control audio here
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleSound}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-600" />
      ) : (
        <Volume2 className="w-5 h-5 text-gray-600" />
      )}
    </motion.button>
  );
}

// Magnetic Button Effect
export function MagneticButton({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<typeof motion.button>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"
        whileHover={{ scale: 1.5 }}
      />
    </motion.button>
  );
}

// Ripple Effect Button
type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export function RippleButton({
  children,
  onClick,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<'button'>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white opacity-30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </button>
  );
}

// Mouse Follower
export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    />
  );
}

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

interface FloatingParticlesProps {
  particleCount?: number;
  className?: string;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  particleCount = 50, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      ctx.scale(dpr, dpr);
    };

    const createParticle = (): Particle => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      return {
        x: Math.random() * rect.width,
        y: -10, // Start above the canvas
        size: Math.random() * 40 + 20, // Double the size (20-60px)
        speedX: (Math.random() - 0.5) * 0.2, // Very slight horizontal drift
        speedY: Math.random() * 1 + 0.5, // Faster downward movement
        opacity: Math.random() * 0.8 + 0.5,
        hue: 320, // Light pink color
        life: 0,
        maxLife: Math.random() * 800 + 400
      };
    };

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle();
        // Distribute particles across the entire canvas initially
        particle.y = Math.random() * canvas.height;
        // Stagger their life cycle so they don't all reset at once
        particle.life = Math.random() * particle.maxLife;
        particlesRef.current.push(particle);
      }
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life++;

      // Smooth fade in and out
      const lifeProgress = particle.life / particle.maxLife;
      if (lifeProgress < 0.1) {
        particle.opacity = (lifeProgress / 0.1) * 0.8;
      } else if (lifeProgress > 0.9) {
        particle.opacity = ((1 - lifeProgress) / 0.1) * 0.8;
      }

      // Very subtle horizontal drift
      particle.x += Math.sin(particle.life * 0.005) * 0.05;
      
      // Reset particle when it goes well below the canvas or reaches max life
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      if (particle.y > rect.height + 50 || particle.life >= particle.maxLife) {
        Object.assign(particle, createParticle());
      }
      
      // Reset if it goes too far horizontally
      if (particle.x < -10 || particle.x > rect.width + 10) {
        particle.x = Math.random() * rect.width;
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      
      // Create soft glowing ball with no border
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      
      // Light pink glowing effect - soft transition to transparent
      gradient.addColorStop(0, `hsla(320, 70%, 85%, ${particle.opacity * 0.9})`);
      gradient.addColorStop(0.3, `hsla(320, 60%, 80%, ${particle.opacity * 0.6})`);
      gradient.addColorStop(0.6, `hsla(320, 50%, 75%, ${particle.opacity * 0.3})`);
      gradient.addColorStop(1, `hsla(320, 40%, 70%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });


      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        mixBlendMode: 'normal',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
      }}
    />
  );
};

export default FloatingParticles;
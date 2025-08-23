import { useEffect } from 'react';

export const useViewportFix = () => {
  useEffect(() => {
    // Fix viewport height on mobile browsers
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    setViewportHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    // Prevent horizontal scroll on mobile
    const preventHorizontalScroll = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.clientX;
      
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const moveTouch = moveEvent.touches[0];
        const diffX = Math.abs(moveTouch.clientX - startX);
        
        // If horizontal movement is detected, prevent default
        if (diffX > 5) {
          const scrollableElement = (moveEvent.target as HTMLElement).closest('[data-scrollable]');
          if (!scrollableElement) {
            moveEvent.preventDefault();
          }
        }
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchend', handleTouchEnd);
    };

    // Add touch listener for preventing horizontal scroll
    document.addEventListener('touchstart', preventHorizontalScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
      document.removeEventListener('touchstart', preventHorizontalScroll);
    };
  }, []);
};
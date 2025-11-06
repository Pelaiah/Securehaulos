import React, { useRef, useEffect } from 'react';
// Import your configured GSAP file
import { gsap } from '../lib/gsap'; 

const ParallaxWrapper = ({ children }: { children: React.ReactNode }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    // Basic ScrollTrigger animation example:
    gsap.to(elementRef.current, {
      y: -500, // Move the element up 500px 
      ease: "none",
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top bottom", // Start when the top of the element hits the bottom of the viewport
        end: "bottom top", // End when the bottom of the element leaves the top of the viewport
        scrub: true, // Link the animation directly to the scrollbar
      },
    });
  }, []);

  return <div ref={elementRef}>{children}</div>;
};

export default ParallaxWrapper;

// Import the core GSAP library
import { gsap } from "gsap";

// Import the plugins you need (e.g., ScrollTrigger for your portfolio's ParallaxWrapper)
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugins with GSAP
gsap.registerPlugin(ScrollTrigger);

// Optional: You can export the GSAP instance for use in other files
export { gsap, ScrollTrigger };
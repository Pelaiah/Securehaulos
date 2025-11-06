
// Import the core GSAP library
import { gsap } from "gsap";

// Import the plugins you need
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";

// Register the plugins with GSAP
gsap.registerPlugin(ScrollTrigger, CustomEase, CustomWiggle);

// Optional: You can export the GSAP instance and plugins for use in other files
export { gsap, ScrollTrigger, CustomEase, CustomWiggle };

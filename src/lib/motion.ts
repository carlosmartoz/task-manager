import type { Transition } from "framer-motion";

// Framer Animations
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeIn = {
  exit: { opacity: 0 },
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" } satisfies Transition,
};

export const fadeInUp = {
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 10 },
  transition: { duration: 0.4, ease: EASE_EXPO } satisfies Transition,
};

export const scaleIn = {
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  initial: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.18, ease: "easeOut" } satisfies Transition,
};

export const slideDown = {
  exit: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: -6 },
  transition: { duration: 0.16, ease: "easeOut" } satisfies Transition,
};

import type { Transition } from "framer-motion";

// Reusable enter/exit variants, equivalent to the CSS animations that used to
// live in globals.css. Apply them with `<motion.div {...fadeIn} />`.

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: "easeOut" } satisfies Transition,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: EASE_EXPO } satisfies Transition,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.18, ease: "easeOut" } satisfies Transition,
};

export const slideDown = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.16, ease: "easeOut" } satisfies Transition,
};

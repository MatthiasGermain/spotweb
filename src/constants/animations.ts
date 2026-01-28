// Animation durations (in seconds)
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
  underline: 1,
} as const;

// Animation delays for staggered effects (in seconds)
export const ANIMATION_STAGGER = {
  small: 0.08,
  medium: 0.1,
  large: 0.15,
  xlarge: 0.2,
} as const;

// Easing curves
export const EASING = {
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  power4Out: "power4.out",
  power3In: "power3.in",
  easeOut: "easeOut",
  default: "ease-out",
} as const;

// Intersection Observer defaults
export const INTERSECTION_DEFAULTS = {
  threshold: 0.3,
  rootMargin: "-100px",
  rootMarginSmall: "-50px",
} as const;

// Scroll triggers
export const SCROLL_TRIGGER = {
  headerGlass: 20,
  scrollToTop: 400,
} as const;

// Animation delay presets (in milliseconds as strings for CSS)
export const DELAY = {
  none: "0ms",
  short: "100ms",
  medium: "200ms",
  long: "400ms",
  veryLong: "600ms",
} as const;

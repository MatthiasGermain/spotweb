// Primary color classes
export const BG_COLORS = {
  primary: "bg-sunglow",
  secondary: "bg-violet",
  dark: "bg-raisin",
  light: "bg-cream",
  white: "bg-white",
} as const;

export const TEXT_COLORS = {
  primary: "text-raisin",
  inverse: "text-white",
  highlight: "text-sunglow",
  secondary: "text-violet",
  indigo: "text-indigo",
} as const;

// Semantic colors for specific sections
export const SECTION_COLORS = {
  hero: {
    bg: BG_COLORS.light,
    text: TEXT_COLORS.primary,
  },
  services: {
    bg: BG_COLORS.light,
    highlight: BG_COLORS.primary,
  },
  team: {
    bg: BG_COLORS.light,
    text: TEXT_COLORS.primary,
  },
  testimonials: {
    bg: BG_COLORS.dark,
    text: TEXT_COLORS.inverse,
    highlight: TEXT_COLORS.highlight,
  },
  footer: {
    bg: BG_COLORS.secondary,
    text: TEXT_COLORS.inverse,
  },
} as const;

// CSS variable colors (for use in inline styles)
export const CSS_COLORS = {
  sunglow: "var(--color-sunglow)",
  violet: "var(--color-violet)",
  raisin: "var(--color-raisin)",
  cream: "var(--color-cream)",
  indigo: "var(--color-indigo)",
  white: "var(--color-white)",
} as const;

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialItem {
  label: string;
  link: string;
}

// Team types
export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  instagram: string;
}

// Testimonial types
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

// Theme types
export interface PageTheme {
  bg: string;
  text: string;
  logo: string;
  glass: string;
  underline: string;
}

// Component variant types
export const BUTTON_COLOR_SCHEMES = ["sunglow", "violet", "raisin", "white"] as const;
export type ButtonColorScheme = (typeof BUTTON_COLOR_SCHEMES)[number];

export const BUTTON_SIZES = ["sm", "md", "lg"] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

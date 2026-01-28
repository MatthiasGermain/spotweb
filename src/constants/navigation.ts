export const NAVIGATION_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Notre histoire", href: "/notre-histoire" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/spotlight.crea/",
  linkedin: "https://www.linkedin.com/company/spotlightcrea",
} as const;

export const SOCIAL_ITEMS = [
  { label: "Instagram", link: SOCIAL_LINKS.instagram },
  { label: "LinkedIn", link: SOCIAL_LINKS.linkedin },
] as const;

export const CONTACT_EMAIL = "contact@spotlightcrea.com" as const;

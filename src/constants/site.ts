// Métadonnées globales du site, utilisées pour le SEO et l'OpenGraph.

export const SITE_URL = "https://spotlightcrea.fr";

export const SITE_NAME = "Spotlight";

export const SITE_DESCRIPTION =
  "Spotlight est une agence de communication chrétienne qui accompagne les structures et projets à mettre en lumière leurs actions pour atteindre leurs objectifs.";

// Image utilisée par défaut pour les partages sur les réseaux (OpenGraph / Twitter).
export const SITE_OG_IMAGE = {
  url: "/images/SpotlightTeam.jpg",
  width: 1908,
  height: 1272,
  alt: "L'équipe Spotlight",
};

// Informations sur l'organisation, utilisées pour les données structurées (JSON-LD).
export const ORGANIZATION = {
  legalName: "ExpresSon",
  siren: "511 125 767",
  logo: `${SITE_URL}/images/logo_noir_sans_fond.png`,
  address: {
    streetAddress: "11 rue de l'avant garde",
    postalCode: "54340",
    addressLocality: "Pompey",
    addressCountry: "FR",
  },
} as const;

// Code de vérification Google Search Console (balise meta).
// À renseigner depuis Search Console → Propriété par balise HTML.
export const GOOGLE_SITE_VERIFICATION: string = "";

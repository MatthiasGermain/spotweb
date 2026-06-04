// Source unique des services proposés par Spotlight.
// Consommée par la section Services de l'accueil et la page /services.

export interface Service {
  title: string;
  description: string;
  subServices: string[];
}

export const SERVICES: Service[] = [
  {
    title: "STRATÉGIE",
    description:
      "On clarifie votre message et on trace le chemin pour qu'il atteigne les bonnes personnes, au bon moment.",
    subServices: [
      "Campagne de communication",
      "Accompagnement personnalisé",
      "Plan de communication 360°",
      "Crowdfunding",
    ],
  },
  {
    title: "GRAPHISME",
    description:
      "Une identité visuelle forte et des supports soignés qui donnent à votre projet l'image qu'il mérite.",
    subServices: ["Identité visuelle", "Affiche", "Flyer", "Brochure", "Livret", "Kakémono"],
  },
  {
    title: "SITE WEB",
    description:
      "Des sites clairs, rapides et à votre image, pensés pour être faciles à faire vivre au quotidien.",
    subServices: ["Création", "Maintenance", "Gestion de contenu", "Visibilité"],
  },
  {
    title: "VIDÉO",
    description:
      "Des images qui racontent votre histoire et captent l'attention, du tournage au montage final.",
    subServices: [
      "Vidéos promotionnelles",
      "Récaps d'événement",
      "Shorts/formats verticaux",
      "Clips",
    ],
  },
  {
    title: "MOTION DESIGN",
    description:
      "On anime votre message pour le rendre vivant, pédagogique et mémorable.",
    subServices: ["Vidéos explicatives", "Animation de logo", "Habillage de vidéo"],
  },
  {
    title: "RÉSEAUX SOCIAUX",
    description:
      "Une présence régulière et engageante pour faire grandir votre communauté et garder le lien.",
    subServices: [
      "Création de contenu engageant",
      "Planning éditorial",
      "Formation",
      "Community management",
    ],
  },
];

// Dérivés pratiques pour les composants existants.
export const SERVICE_NAMES = SERVICES.map((s) => s.title);

export const SUB_SERVICES: Record<string, string[]> = Object.fromEntries(
  SERVICES.map((s) => [s.title, s.subServices])
);

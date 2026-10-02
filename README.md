# Spotlight - Site Web

Site web officiel de l'association Spotlight, agence de communication dédiée à mettre en lumière les projets et actions qui comptent vraiment. En ligne sur [spotlightcrea.fr](https://spotlightcrea.fr).

<!-- À COMPLÉTER : une capture de la page d'accueil (et éventuellement une du module /ndf), ex. docs/screenshots/accueil.png -->

## Contexte

Je suis responsable web bénévole de l'association : j'ai développé le site public (pages, composants, animations, formulaire de contact, newsletter).

Le module de notes de frais (`/ndf`) est développé par un autre bénévole. Les contributions passent par des pull requests sur ce dépôt.

## Fonctionnalités

- **Site vitrine** : accueil, notre histoire, services, contact, mentions légales.
- **Formulaire de contact** : server action Next.js, envoi de l'e-mail avec Resend.
- **Newsletter en double opt-in** : le formulaire envoie un e-mail de confirmation (Resend) avec un lien signé ; le contact n'est inscrit dans Mailchimp qu'après le clic sur ce lien.
- **Notes de frais (`/ndf`)** : application interne pour les membres de l'association, avec connexion, dépôt d'une note de frais et de ses justificatifs, génération du PDF, notification par e-mail, historique et administration.

## Stack Technique

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, TypeScript 5
- **Styles** : Tailwind CSS 4
- **Animations** : Framer Motion, GSAP
- **Icônes** : Lucide React
- **E-mails** : Resend (contact, newsletter), Mailchimp (liste de diffusion)
- **Module `/ndf`** : Prisma, PostgreSQL (Neon), Vercel Blob, pdf-lib, Nodemailer
- **Hébergement** : Vercel

## Installation

```bash
# Installation des dépendances
npm install

# Variables d'environnement (voir les commentaires du fichier)
cp .env.example .env

# Lancement du serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) pour voir le site.

## Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Prisma (generate + migrations) puis build de production
npm start            # Démarrage du serveur de production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript (sans compilation)
npm run format       # Formatage du code avec Prettier
npm run format:check # Vérification du formatage
```

## Structure du Projet

```
prisma/                     # Schéma de la base du module /ndf
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── contact/           # Page contact
│   ├── services/          # Page services
│   ├── notre-histoire/    # Page histoire
│   ├── newsletter/        # Confirmation d'inscription
│   ├── mentions-legales/
│   └── ndf/               # Application notes de frais
├── components/
│   ├── home/              # Composants page d'accueil
│   ├── contact/           # Composants page contact
│   ├── layout/            # Header, Footer, etc.
│   ├── histoire/          # Composants page histoire
│   ├── ndf/               # Composants du module /ndf
│   └── ui/                # Composants UI réutilisables
├── lib/                   # Newsletter (jetons, e-mails), logique du module /ndf
├── hooks/                 # Hooks React personnalisés
├── constants/             # Constantes (navigation, couleurs, animations, etc.)
└── types/                 # Types TypeScript
```

## Composants Clés

- **AnimatedUnderlineText** - Soulignement animé au scroll
- **useIntersectionTrigger** - Hook pour détecter la visibilité des éléments
- **Logo** - Composant SVG du logo Spotlight
- **StaggeredMenu** - Menu mobile avec animations

## Déploiement

Le site est déployé sur [Vercel](https://vercel.com). Les déploiements se font automatiquement à chaque push sur la branche `main`.

```bash
# Build local pour tester
npm run build
npm start
```

## Contact

Pour toute question concernant le projet, contacter [contact@spotlightcrea.fr](mailto:contact@spotlightcrea.fr)

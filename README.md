# Spotlight - Site Web

Site web officiel de l'association Spotlight, agence de communication dédiée à mettre en lumière les projets et actions qui comptent vraiment.

## Stack Technique

- **Framework**: Next.js 16.1.4 (App Router)
- **UI**: React 19.2, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion, GSAP
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Installation

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) pour voir le site.

## Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm start            # Démarrage du serveur de production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript (sans compilation)
npm run format       # Formatage du code avec Prettier
npm run format:check # Vérification du formatage
```

## Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── contact/           # Page contact
│   ├── services/          # Page services
│   └── notre-histoire/    # Page histoire
├── components/
│   ├── home/              # Composants page d'accueil
│   ├── contact/           # Composants page contact
│   ├── layout/            # Header, Footer, etc.
│   └── ui/                # Composants UI réutilisables
├── hooks/                 # Hooks React personnalisés
├── constants/             # Constantes (navigation, couleurs, animations, etc.)
├── types/                 # Types TypeScript
└── styles/                # Styles globaux
```

## Pages

- **Accueil** (`/`) - Hero, services, équipe, témoignages
- **Notre Histoire** (`/notre-histoire`) - Histoire de l'association et collage photos
- **Services** (`/services`) - Détails des services proposés
- **Contact** (`/contact`) - Formulaire de contact et informations

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

Pour toute question concernant le projet, contacter [contact@spotlightcrea.com](mailto:contact@spotlightcrea.com)

---

Développé avec Next.js et déployé sur Vercel

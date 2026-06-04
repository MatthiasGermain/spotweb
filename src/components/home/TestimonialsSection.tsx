"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button } from "@/components/ui";

interface ArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

function ArrowButton({ direction, onClick }: ArrowButtonProps) {
  const yellowControls = useAnimation();
  const whiteControls = useAnimation();
  const isHoveredRef = useRef(false);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    yellowControls.start({
      scale: 1.08,
      transition: { duration: 0.2, ease: "easeOut" },
    });
    whiteControls.start({
      scale: 1.15,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    yellowControls.start({
      scale: 1,
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });
    whiteControls.start({
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  };

  const handleClick = async () => {
    // White triangle zooms in then out (returns to hover scale if still hovering)
    await whiteControls.start({
      scale: 1.25,
      transition: { duration: 0.1 },
    });
    whiteControls.start({
      scale: isHoveredRef.current ? 1.15 : 1,
      transition: { duration: 0.1 },
    });

    // Yellow does a bounce in the arrow direction
    const bounceX = direction === "right" ? 3 : -3;
    yellowControls.start({
      x: [0, bounceX, 0],
      transition: { duration: 0.25, times: [0, 0.4, 1], ease: "easeOut" },
    });

    // Navigation happens when yellow starts moving
    onClick();
  };

  const isLeft = direction === "left";

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute z-10 p-2 ${
        isLeft ? "-left-2 sm:-left-4 lg:-left-8" : "-right-2 sm:-right-4 lg:-right-8"
      }`}
      aria-label={isLeft ? "Témoignage précédent" : "Témoignage suivant"}
    >
      <div className="relative h-8 w-10 sm:h-10 sm:w-12 lg:h-14 lg:w-16">
        <svg
          className="absolute left-0 top-0 h-full w-full overflow-visible"
          viewBox="0 0 18 14"
        >
          {/* Yellow triangle (shadow) */}
          <motion.path
            d={isLeft ? "M14 14V0L0 7z" : "M4 0v14l14-7z"}
            className="fill-sunglow"
            animate={yellowControls}
            style={{
              originX: isLeft ? "0px" : "18px",
              originY: "7px",
            }}
          />
          {/* White triangle */}
          <motion.path
            d={isLeft ? "M18 14V0L4 7z" : "M0 0v14l14-7z"}
            className="fill-white"
            animate={whiteControls}
            style={{
              originX: isLeft ? "4px" : "14px",
              originY: "7px",
            }}
          />
        </svg>
      </div>
    </button>
  );
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Eva Bouazize",
    role: "Artiste chrétienne",
    quote:
      "J'ai choisi SPOTLIGHT pour leur qualité de travail, leur proximité et accessibilité : la force de Spotlight c'est la fraîcheur de l'équipe qui est dans l'air du temps en terme de contenus et d'idées!!!",
    image: "/images/testimonials/eva.jpg",
  },
  {
    id: 2,
    name: "Yaëlle César",
    role: "CNEF",
    quote:
      "On sent qu'il y a de la passion et de la cohésion dans l'équipe, le travail est pro et qualitatif. On a beaucoup aimé la qualité du travail fourni, les efforts pour comprendre le projet et respecter les deadlines, la réactivité malgré les imprévus de notre côté et les procédures claires. Merci beaucoup pour votre travail, on a hâte de collaborer à nouveau ensemble !",
  },
  {
    id: 3,
    name: "Pierre Patient",
    role: "Librairie Certitude",
    quote: "Ils sont excellents, ils mettent leurs talents au service de votre vision !",
  },
  {
    id: 4,
    name: "Thomas Merkling",
    role: "Église évangélique de Vandœuvre",
    quote:
      "Vous avez plein de compétences différentes dans l'équipe, vous n'êtes pas là pour faire des sous mais pour faire des choses de qualité pour les œuvres chrétiennes. L'accompagnement peut se faire de manière assez personnalisé et spécifique. Une équipe généreuse, talentueuse et à l'écoute, on vous les recommande vivement !",
  },
  {
    id: 5,
    name: "Victoria Hary",
    role: "Mouvement des Flambeaux et des Claires Flammes",
    quote:
      "J'ai aimé la polyvalence de Spotlight, la facilité des échanges et la pertinence du travail. Ils sont multi-talents et centrés sur Jésus ! Continuez comme ça !! Hâte de voir vos futurs projets.",
  },
  {
    id: 6,
    name: "Rachel Nicosia",
    role: "Église Connexion de Pompey",
    quote:
      "Une équipe jeune et dynamique qui crée une communication moderne et pertinente, qui change un peu de ce qu'on peut connaître dans certains milieux chrétiens. Ils sont rapides avec une simplicité d'échanges. Franchement le travail est top et on était très contents du résultat.",
  },
  {
    id: 7,
    name: "Adeline Herr",
    role: "Éducatrice spécialisée",
    quote:
      "J'ai apprécié leur gentillesse, leur écoute et leurs compétences qui étaient propres, professionnelles et agréables.",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function TestimonialsSection() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const paginate = (newDirection: number) => {
    const newIndex = activeIndex + newDirection;
    if (newIndex >= 0 && newIndex < testimonials.length) {
      setActiveIndex([newIndex, newDirection]);
    } else if (newIndex < 0) {
      setActiveIndex([testimonials.length - 1, newDirection]);
    } else {
      setActiveIndex([0, newDirection]);
    }
  };

  const currentTestimonial = testimonials[activeIndex];

  // Rotation automatique (en pause au survol)
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setActiveIndex(([i]) => [(i + 1) % testimonials.length, 1]);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused]);

  return (
    <section className="relative overflow-hidden bg-raisin py-12 sm:py-16 lg:py-20">
      {/* Decorative striped element - bottom right */}
      <div className="pointer-events-none absolute -right-16 -bottom-16 sm:-right-12 sm:-bottom-12 lg:-right-8 lg:-bottom-8" aria-hidden="true">
        <svg
          viewBox="0 0 400 400"
          className="h-64 w-64 sm:h-60 sm:w-60 lg:h-72 lg:w-72 opacity-100"
        >
          <defs>
            <pattern
              id="testimonial-stripes"
              patternUnits="userSpaceOnUse"
              width="600"
              height="20"
            >
              <rect width="400" height="10" fill="#1c27300d" />
              <rect y="10" width="400" height="10" fill="transparent" />
            </pattern>
          </defs>
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="url(#testimonial-stripes)"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="mb-8 font-avenir text-2xl font-black text-sunglow sm:mb-12 sm:text-4xl lg:text-6xl">
          IL NOUS ONT FAIT CONFIANCE...
        </h2>

        {/* Carousel container with arrows */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left arrow */}
          <ArrowButton direction="left" onClick={() => paginate(-1)} />

          {/* Carousel content - hauteur fixe pour éviter les sauts entre témoignages */}
          <div className="mx-auto flex h-120 w-full max-w-5xl items-center overflow-hidden px-14 sm:px-16 lg:px-20">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentTestimonial.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -10000) {
                    paginate(1);
                  } else if (swipe > 10000) {
                    paginate(-1);
                  }
                }}
                className={`flex h-full w-full flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10 ${
                  currentTestimonial.image ? "sm:flex-row" : ""
                }`}
              >
                {/* Photo (optionnelle) - format portrait */}
                {currentTestimonial.image && (
                  <div className="relative aspect-4/5 h-56 w-auto shrink-0 overflow-hidden sm:h-80 lg:h-96">
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className={`flex flex-col justify-center ${
                    currentTestimonial.image
                      ? "items-center text-center sm:flex-1 sm:items-start sm:text-left"
                      : "mx-auto max-w-3xl items-center text-center"
                  }`}
                >
                  {!currentTestimonial.image && (
                    <span className="-mb-4 font-avenir text-7xl font-black leading-none text-sunglow sm:text-8xl">
                      &ldquo;
                    </span>
                  )}
                  {/* Name with underline */}
                  <div className="mb-1">
                    <h3 className="font-avenir text-2xl font-black uppercase text-white sm:text-3xl lg:text-4xl">
                      {currentTestimonial.name}
                    </h3>
                  </div>
                  {/* Role */}
                  <p className="mb-2 font-montserrat text-sm font-medium text-white sm:text-base">
                    {currentTestimonial.role}
                  </p>
                  {/* Yellow underline */}
                  <div className="mb-4 h-3 w-32 bg-sunglow sm:w-70 lg:w-91" />
                  {/* Quote */}
                  <p className="max-w-lg font-montserrat text-sm leading-relaxed text-white sm:text-base lg:text-lg">
                    &ldquo; {currentTestimonial.quote} &rdquo;
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <ArrowButton direction="right" onClick={() => paginate(1)} />
        </div>

        {/* CTA Button - centered */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Link href="/contact">
            <Button colorScheme="white" size="lg">
              Tu veux en faire parti?
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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

const testimonials = [
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
    name: "Lorem ipsum",
    role: "consectetur adipiscing",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/images/testimonials/thomas.jpg",
  },
  {
    id: 3,
    name: "Lorem ipsum",
    role: "consectetur adipiscing",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/images/testimonials/thomas.jpg",
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

  return (
    <section className="relative overflow-hidden bg-[#1e2952] py-12 sm:py-16 lg:py-20">
      {/* Decorative striped element - bottom right */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 sm:-bottom-12 sm:-right-12 lg:-bottom-8 lg:-right-8">
        <Image
          src="/images/decorations/zebra-striped round.svg"
          alt=""
          width={300}
          height={300}
          className="h-48 w-48 opacity-60 sm:h-56 sm:w-56 lg:h-64 lg:w-64"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="mb-8 font-avenir text-2xl font-bold text-sunglow sm:mb-12 sm:text-3xl lg:text-4xl">
          IL NOUS ONT FAIT CONFIANCE...
        </h2>

        {/* Carousel container with arrows */}
        <div className="relative flex items-center">
          {/* Left arrow */}
          <ArrowButton direction="left" onClick={() => paginate(-1)} />

          {/* Carousel content */}
          <div className="mx-auto min-h-140 w-full max-w-5xl overflow-hidden px-4 sm:min-h-120 sm:px-8 lg:px-10">
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
                className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:gap-8 lg:gap-10"
              >
                {/* Photo - scaled x1.7 */}
                <div className="relative aspect-4/5 w-96 shrink-0 overflow-hidden sm:w-[55%]">
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Content - 65% on desktop */}
                <div className="flex flex-col items-center justify-center text-center sm:w-[65%] sm:items-start sm:text-left">
                  {/* Name with underline */}
                  <div className="mb-1">
                    <h3 className="font-avenir text-2xl font-bold uppercase text-white sm:text-3xl lg:text-4xl">
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
          <Link
            href="/contact"
            className="inline-block rounded-full border-2 border-white bg-[#1e2952] px-6 py-2 font-montserrat text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1e2952]/70 sm:px-8 sm:py-3 sm:text-base"
          >
            Tu veux en faire parti?
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { AnimatedUnderlineText } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";
import { DELAY } from "@/constants";

export function ServicesHero() {
  const { ref, isVisible } = useIntersectionTrigger<HTMLDivElement>({
    threshold: 0.3,
    rootMargin: "-50px",
  });

  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-20 lg:py-28">
      {/* Cercle rayé décoratif - coin haut droit */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 sm:-right-16 sm:-top-16"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72">
          <defs>
            <pattern id="hero-stripes" patternUnits="userSpaceOnUse" width="600" height="20">
              <rect width="400" height="10" fill="#FCCA46" />
              <rect y="10" width="400" height="10" fill="transparent" />
            </pattern>
          </defs>
          <circle cx="200" cy="200" r="190" fill="url(#hero-stripes)" opacity="0.7" />
        </svg>
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-avenir text-5xl font-black uppercase leading-none tracking-wide text-raisin sm:text-7xl lg:text-8xl">
          <AnimatedUnderlineText isVisible={isVisible}>NOS</AnimatedUnderlineText>
          <br />
          <AnimatedUnderlineText isVisible={isVisible} delay={DELAY.medium}>
            SERVICES
          </AnimatedUnderlineText>
        </h1>

        <p className="mt-8 max-w-2xl font-montserrat text-base leading-relaxed text-raisin/80 sm:text-lg lg:text-xl">
          De la première idée à la diffusion, on met en lumière ce que vous avez à dire. Voici tout
          ce qu'on peut faire ensemble pour donner à votre message clarté, portée et sens.
        </p>
      </div>
    </section>
  );
}

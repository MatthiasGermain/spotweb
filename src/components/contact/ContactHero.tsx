"use client";

import { AnimatedUnderlineText } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";
import { CSS_COLORS } from "@/constants";

export function ContactHero() {
  const { ref: sectionRef, isVisible } = useIntersectionTrigger<HTMLElement>({
    threshold: 0.3,
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sunglow py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtitle */}
        <p className="mb-16 sm:text-xl lg:text-2xl font-semibold uppercase tracking-widest text-white">
          Contact
        </p>

        {/* Main title */}
        <h1 className="mb-10 text-4xl font-black tracking-tight text-raisin sm:text-6xl lg:text-7xl">
          <AnimatedUnderlineText
            isVisible={isVisible}
            color={CSS_COLORS.white}
            className="inline px-2 sm:px-4"
          >
            METTRE EN LUMIÈRE
          </AnimatedUnderlineText>
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-white sm:text-lg">
          Spotlight vous accompagne pour mettre en lumière vos projets et vos actions.
          Nous croyons qu&apos;une communication juste et inspirée peut servir votre vision et porter votre impact.
          Partagez avec nous vos besoins, vos objectifs et vos échéances : ensemble, nous construirons une stratégie alignée avec vos valeurs
          pour donner à votre message clarté, portée et sens.
        </p>
      </div>
    </section>
  );
}

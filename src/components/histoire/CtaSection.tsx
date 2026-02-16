"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { AnimatedUnderlineText, Button } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";

export function CtaSection() {
  const { ref, isVisible } = useIntersectionTrigger({ threshold: 0.3 });

  return (
    <section ref={ref} className="bg-cream py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        {/* Carte sunglow */}
        <div className="relative overflow-hidden rounded-3xl bg-sunglow p-8 sm:p-12 lg:p-16">
          <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12 lg:gap-16">
            {/* Texte + bouton */}
            <div className="flex-1 text-right">
              <h2 className="font-avenir font-bold text-raisin text-xl sm:text-2xl lg:text-3xl uppercase leading-snug tracking-wide mb-8">
                Maintenant que vous nous connaissez,{" "}
                <AnimatedUnderlineText
                  isVisible={isVisible}
                  color="#f4f0ec"
                  delay="200ms"
                >
                  on serait ravis d&apos;apprendre à vous connaître pour
                  avoir l&apos;opportunité de mettre en lumière votre
                  projet.
                </AnimatedUnderlineText>
              </h2>
              <Link href="/contact">
                <Button colorScheme="raisin" size="lg">
                  Contactez-nous
                </Button>
              </Link>
            </div>

            {/* Photo d'équipe */}
            <div className="w-full sm:w-2/5 shrink-0">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/team/fun4.jpg"
                  alt="L'équipe Spotlight"
                  width={900}
                  height={900}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Decorative striped circle - bottom left */}
          <div className="pointer-events-none absolute -left-16 -bottom-16 sm:-left-12 sm:-bottom-12" aria-hidden="true">
            <svg
              viewBox="0 0 400 400"
              className="h-56 w-56 sm:h-52 sm:w-52 lg:h-64 lg:w-64"
            >
              <defs>
                <pattern
                  id="cta-stripes"
                  patternUnits="userSpaceOnUse"
                  width="600"
                  height="20"
                >
                  <rect width="400" height="10" fill="#f4f0ec" />
                  <rect y="10" width="400" height="10" fill="transparent" />
                </pattern>
              </defs>
              <circle
                cx="200"
                cy="200"
                r="190"
                fill="url(#cta-stripes)"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Link } from "next-view-transitions";
import { AnimatedUnderlineText, Button } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";

export function ServicesCta() {
  const { ref, isVisible } = useIntersectionTrigger({ threshold: 0.3 });

  return (
    <section ref={ref} className="bg-cream pb-16 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        {/* Carte sunglow */}
        <div className="relative overflow-hidden rounded-3xl bg-sunglow p-8 text-center sm:p-12 lg:p-16">
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-8 font-avenir text-xl font-bold uppercase leading-snug tracking-wide text-raisin sm:text-2xl lg:text-3xl">
              Un projet, une idée, une envie ?{" "}
              <AnimatedUnderlineText isVisible={isVisible} color="#f4f0ec" delay="200ms">
                Parlons-en, et trouvons ensemble la meilleure façon de le mettre en lumière.
              </AnimatedUnderlineText>
            </h2>
            <Link href="/contact">
              <Button colorScheme="raisin" size="lg">
                Contactez-nous
              </Button>
            </Link>
          </div>

          {/* Cercle rayé décoratif - bas gauche */}
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 sm:-bottom-12 sm:-left-12"
            aria-hidden="true"
          >
            <svg viewBox="0 0 400 400" className="h-56 w-56 sm:h-52 sm:w-52 lg:h-64 lg:w-64">
              <defs>
                <pattern id="cta-services-stripes" patternUnits="userSpaceOnUse" width="600" height="20">
                  <rect width="400" height="10" fill="#f4f0ec" />
                  <rect y="10" width="400" height="10" fill="transparent" />
                </pattern>
              </defs>
              <circle cx="200" cy="200" r="190" fill="url(#cta-services-stripes)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

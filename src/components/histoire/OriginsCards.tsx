"use client";

import { AnimatedUnderlineText } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";

export function OriginsCards() {
  const { ref, isVisible } = useIntersectionTrigger({ threshold: 0.3 });

  return (
    <section ref={ref} className="bg-sunglow py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-12">
          {/* Card Premièrement */}
          <div className="rounded-3xl bg-cream p-8 sm:p-10 lg:p-12">
            <h3 className="font-avenir font-black text-cyan text-2xl sm:text-3xl lg:text-4xl tracking-wide uppercase mb-6">
              Premièrement
            </h3>
            <p className="font-montserrat font-bold text-raisin text-sm sm:text-base lg:text-lg leading-relaxed">
              Les églises et{" "}
              <AnimatedUnderlineText isVisible={isVisible} delay="200ms">
                les œuvres chrétiennes
              </AnimatedUnderlineText>{" "}
              ont réellement{" "}
              <AnimatedUnderlineText isVisible={isVisible} delay="400ms">
                besoin de moyens de communication pertinents
              </AnimatedUnderlineText>{" "}
              et{" "}
              <AnimatedUnderlineText isVisible={isVisible} delay="600ms">
                modernes
              </AnimatedUnderlineText>{" "}
              pour rejoindre notre génération et partager l&apos;Évangile.
            </p>
          </div>

          {/* Card Deuxièmement */}
          <div className="rounded-3xl bg-cream p-8 sm:p-10 lg:p-12">
            <h3 className="font-avenir font-black text-cyan text-2xl sm:text-3xl lg:text-4xl tracking-wide uppercase mb-6">
              Deuxièmement
            </h3>
            <p className="font-montserrat font-bold text-raisin text-sm sm:text-base lg:text-lg leading-relaxed">
              Chacun de nous était déjà investis et sur-engagé dans la
              communication de différentes œuvres, alors que nos compétences
              étaient pourtant complémentaires. Graphiste, rédacteur, monteur,
              community manager... Nous avons réalisé qu&apos;avec{" "}
              <AnimatedUnderlineText isVisible={isVisible} delay="500ms">
                nos compétences spécifiques
              </AnimatedUnderlineText>{" "}
              et nos{" "}
              <AnimatedUnderlineText isVisible={isVisible} delay="700ms">
                dons particuliers
              </AnimatedUnderlineText>
              , nous pouvions créer{" "}
              <AnimatedUnderlineText isVisible={isVisible} delay="900ms">
                une synergie incroyable
              </AnimatedUnderlineText>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { RotatingText } from "@/components/ui";

const beliefs = [
  "à l'ère des médias et de la communication de masse",
  "que l'Église doit briller par une communication de qualité",
  "que la communication des églises doit être à la portée de tous",
  "que l'Église doit rejoindre le monde pour faire connaître l'Évangile de Jésus",
];

export function BeliefBanner() {
  return (
    <section className="bg-raisin py-16 sm:py-15">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        {/* Mobile: colonne centrée */}
        <div className="flex flex-col items-center text-center font-montserrat text-lg sm:text-2xl md:hidden">
          <span className="text-violet mb-2">Nous croyons</span>
          <div className="h-[5em] overflow-hidden">
            <RotatingText
              texts={beliefs}
              splitBy="words"
              staggerDuration={0.025}
              staggerFrom="first"
              rotationInterval={8000}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              mainClassName="w-full justify-center"
              elementLevelClassName="font-bold text-sunglow"
            />
          </div>
        </div>

        {/* Desktop: ligne avec "Nous croyons" à gauche */}
        <div className="hidden md:flex md:items-start md:gap-4 font-montserrat text-2xl lg:text-3xl xl:text-4xl">
          <span className="text-violet shrink-0">Nous croyons</span>
          <div className="h-[3.5em] lg:h-[3em] overflow-hidden flex-1">
            <RotatingText
              texts={beliefs}
              splitBy="words"
              staggerDuration={0.025}
              staggerFrom="first"
              rotationInterval={8000}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-120%", opacity: 0 }}
              mainClassName="w-full"
              elementLevelClassName="font-bold text-sunglow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useIntersectionTrigger } from "@/hooks";

const slideSpring = { type: "spring" as const, stiffness: 100, damping: 20 };

export function ImagineScene() {
  const { ref, isVisible } = useIntersectionTrigger({ threshold: 0.2 });

  return (
    <section ref={ref} className="bg-cyan py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12 lg:gap-16">
          {/* Image — glisse depuis la gauche */}
          <motion.div
            className="w-full sm:w-2/5 shrink-0"
            initial={{ x: -80, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={slideSpring}
          >
            <div className="overflow-hidden rounded-2xl">
              {/* TODO: Remplacer par l'image définitive */}
              <Image
                src="/images/imagine_photo.png"
                alt="L'équipe Spotlight autour d'une table"
                width={900}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Texte — glisse depuis la droite avec léger delay */}
          <motion.div
            className="w-full sm:w-3/5"
            initial={{ x: 80, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ ...slideSpring, delay: 0.15 }}
          >
            <h2 className="font-avenir font-black text-raisin text-3xl sm:text-4xl lg:text-5xl tracking-wide uppercase mb-6">
              Imaginez la
              <br />
              scène
            </h2>
            <p className="font-montserrat text-white text-base sm:text-lg lg:text-xl leading-relaxed">
              Quatre amis réunis autour d&apos;une table en train de discuter et
              de refaire le monde.{" "}
              <strong>
                On se rend alors compte de deux trucs essentiels...
              </strong>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

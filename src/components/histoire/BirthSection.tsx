"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useIntersectionTrigger } from "@/hooks";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.5, type: "spring", duration: 1.5, bounce: 0 },
      opacity: { delay: i * 0.5, duration: 0.01 },
    },
  }),
};

export function BirthSection() {
  const { ref, isVisible } = useIntersectionTrigger({ threshold: 0.3 });
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [arrowPath, setArrowPath] = useState({ curve: "", arrow: "", viewBox: "0 0 800 400" });

  const computePath = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const logo = logoRef.current;
    if (!container || !text || !logo) return;

    const cRect = container.getBoundingClientRect();
    const tRect = text.getBoundingClientRect();
    const lRect = logo.getBoundingClientRect();

    const w = cRect.width;
    const h = cRect.height;

    // Départ : milieu-droite du texte
    const sx = tRect.left - cRect.left + tRect.width * 0.40;
    const sy = tRect.bottom - cRect.top - tRect.height * 0.05;

    // Arrivée : haut du "L" du logo (~30% largeur, ~35% hauteur)
    const ex = lRect.left - cRect.left + lRect.width * 0.5;
    const ey = lRect.top - cRect.top + lRect.height * 0.35;

    // Départ vertical → courbe vers la droite → arrivée verticale
    const curve = `M ${sx} ${sy} C ${sx} ${ey}, ${ex} ${sy}, ${ex} ${ey}`;

    // Pointe de flèche (arrivée verticale → tangente vers le bas)
    const dx = 0;
    const dy = 1;
    const ux = dx;
    const uy = dy;
    const px = -uy;
    const py = ux;
    const aLen = 12;
    const aSpread = 6;

    const a1x = ex - ux * aLen + px * aSpread;
    const a1y = ey - uy * aLen + py * aSpread;
    const a2x = ex - ux * aLen - px * aSpread;
    const a2y = ey - uy * aLen - py * aSpread;

    const arrow = `M ${a1x} ${a1y} L ${ex} ${ey} L ${a2x} ${a2y}`;

    setArrowPath({ curve, arrow, viewBox: `0 0 ${w} ${h}` });
  }, []);

  useEffect(() => {
    computePath();
    window.addEventListener("resize", computePath);
    return () => window.removeEventListener("resize", computePath);
  }, [computePath]);

  return (
    <section ref={ref} className="relative bg-cream py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        {/* Carte arrondie */}
        <div className="relative rounded-3xl bg-cream-dark/20 p-8 sm:p-10 lg:p-12">
          {/* Version mobile (empilée) */}
          <div className="flex flex-col gap-5 sm:hidden">
            <p className="font-avenir font-black text-violet text-xl leading-snug text-center">
              Alors, on a embarqué deux autres potes dans l&apos;aventure et
              c&apos;est comme ça qu&apos;est né...
            </p>
            <div className="flex justify-center gap-3">
              <div className="w-1/2 overflow-hidden rounded-2xl">
                <Image
                  src="/images/birth_1.png"
                  alt="L'équipe Spotlight en selfie"
                  width={600}
                  height={900}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-1/2 overflow-hidden rounded-2xl">
                <Image
                  src="/images/birth_2.png"
                  alt="L'équipe Spotlight au travail"
                  width={600}
                  height={900}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <Image
              src="/images/logo_noir_sans_fond.svg"
              alt="Spotlight"
              width={900}
              height={450}
              className="mx-auto w-3/5 h-auto"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(68%) sepia(18%) saturate(1059%) hue-rotate(237deg) brightness(96%) contrast(87%)",
                opacity: 0.85,
              }}
            />
          </div>

          {/* Version desktop (positionnement libre) */}
          <div ref={containerRef} className="hidden sm:block relative min-h-80 lg:min-h-96">
            {/* Photo 1 - haut gauche */}
            <div className="relative z-10 w-36 lg:w-44 overflow-hidden rounded-2xl">
              <Image
                src="/images/birth_1.png"
                alt="L'équipe Spotlight en selfie"
                width={600}
                height={900}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Texte - au dessus de la photo 2 */}
            <div className="absolute top-4 left-[22%] right-0">
              <p ref={textRef} className="font-avenir font-black text-violet text-2xl lg:text-3xl leading-snug">
                Alors, on a embarqué deux autres potes dans l&apos;aventure et
                c&apos;est comme ça qu&apos;est né...
              </p>
            </div>

            {/* Flèche animée du texte vers le logo */}
            {arrowPath.curve && (
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={arrowPath.viewBox}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                aria-hidden="true"
              >
                <motion.path
                  d={arrowPath.curve}
                  stroke="#8b6db5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="transparent"
                  variants={draw}
                  custom={1}
                />
                <motion.path
                  d={arrowPath.arrow}
                  stroke="#8b6db5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                  variants={draw}
                  custom={1.8}
                />
              </motion.svg>
            )}

            {/* Photo 2 - centre */}
            <div className="absolute left-[22%] -bottom-6 z-10 w-40 lg:w-48 overflow-hidden rounded-2xl">
              <Image
                src="/images/birth_2.png"
                alt="L'équipe Spotlight au travail"
                width={600}
                height={900}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Logo Spotlight en rose/violet - bas droite */}
            <div ref={logoRef} className="absolute right-0 bottom-4 w-[55%] lg:w-[50%]">
              <Image
                src="/images/logo_noir_sans_fond.svg"
                alt="Spotlight"
                width={900}
                height={450}
                className="w-full h-auto"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(68%) sepia(18%) saturate(1059%) hue-rotate(237deg) brightness(96%) contrast(87%)",
                  opacity: 0.45,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative striped circle - bottom left */}
      <div className="absolute -left-14 -bottom-14 sm:-left-10 sm:-bottom-10 lg:-left-8 lg:-bottom-8">
        <Image
          src="/images/decorations/zebra-striped round.svg"
          alt=""
          width={1800}
          height={1800}
          className="h-56 w-56 sm:h-52 sm:w-52 lg:h-64 lg:w-64 opacity-100"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

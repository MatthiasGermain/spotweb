"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useIntersectionTrigger } from "@/hooks";

const slides = [
  { src: "/images/team/fun1.jpg", alt: "L'équipe Spotlight sur le canapé" },
  { src: "/images/team/fun2.jpg", alt: "Duo complice" },
  { src: "/images/team/fun3.jpg", alt: "L'équipe en mode fun" },
  { src: "/images/team/fun4.jpg", alt: "L'équipe Spotlight pose" },
  { src: "/images/team/fun5.jpg", alt: "L'équipe Spotlight" },
  { src: "/images/team/fun6.jpg", alt: "L'équipe Spotlight" },
  { src: "/images/team/fun7.jpg", alt: "L'équipe Spotlight" },
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type Polaroid = {
  src: string;
  alt: string;
  rotate: number;
  yOffset: number;
};

const hoverSpring = { type: "spring" as const, stiffness: 120, damping: 16 };

function PolaroidCard({
  polaroid,
  index,
  isVisible,
  pickZ,
  onPick,
}: {
  polaroid: Polaroid;
  index: number;
  isVisible: boolean;
  pickZ: number;
  onPick: () => void;
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (isVisible) {
      controls.start({
        opacity: 1,
        y: polaroid.yOffset,
        rotate: polaroid.rotate,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 18,
          delay: index * 0.08,
        },
      });
    }
  }, [isVisible, controls, polaroid, index]);

  const handleHoverStart = useCallback(() => {
    onPick();
    controls.start({
      rotate: polaroid.rotate * 0.3,
      scale: 1.05,
      y: polaroid.yOffset - 10,
      transition: hoverSpring,
    });
  }, [controls, polaroid, onPick]);

  const handleHoverEnd = useCallback(() => {
    controls.start({
      rotate: polaroid.rotate,
      scale: 1,
      y: polaroid.yOffset,
      transition: hoverSpring,
    });
  }, [controls, polaroid]);

  return (
    <motion.div
      className="relative shrink-0 cursor-pointer"
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{ zIndex: pickZ || index }}
    >
      {/* Cadre Polaroid */}
      <div
        className="rounded-sm p-2 pb-10 sm:p-3 sm:pb-12 border border-white/40 transition-shadow duration-500 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_30px_rgba(0,0,0,0.45)]"
        style={{
          background:
            "linear-gradient(165deg, #f8f4f0 0%, #ede7e0 60%, #e4ddd5 100%)",
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,0.6), 0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="relative overflow-hidden rounded-sm">
          <img
            src={polaroid.src}
            alt={polaroid.alt}
            className="h-48 sm:h-64 lg:h-80 w-auto rounded-sm object-cover pointer-events-none"
          />
          {/* Light leak / film gradient */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
            style={{
              background: `linear-gradient(${130 + index * 15}deg, rgba(252,202,70,0.6) 0%, rgba(255,120,80,0.4) 30%, transparent 60%)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function FriendsCarousel() {
  const { ref, isVisible } = useIntersectionTrigger({ threshold: 0.15 });
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const [pickCounter, setPickCounter] = useState(slides.length);
  const [pickZMap, setPickZMap] = useState<Record<number, number>>({});
  const [visibleCount, setVisibleCount] = useState(slides.length);

  useEffect(() => {
    setPolaroids(
      shuffle(slides).map((slide) => ({
        ...slide,
        rotate: randomBetween(-8, 8),
        yOffset: randomBetween(-14, 14),
      }))
    );

    function updateCount() {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(3);
      else if (w < 1024) setVisibleCount(4);
      else setVisibleCount(5);
    }
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <section ref={ref} className="overflow-hidden bg-raisin">
      {/* Titre */}
      <div className="py-3 sm:py-4">
        <h2 className="text-left font-avenir font-black text-sunglow text-lg py-4 pl-6 sm:pl-16 sm:text-3xl lg:text-5xl tracking-wide uppercase">
          Avant tout, une bande d&apos;amis...
        </h2>
      </div>

      {/* Polaroids */}
      <div className="pt-8 pb-12 sm:pt-10 sm:pb-16 px-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-center -space-x-6 sm:-space-x-8 lg:-space-x-10">
          {polaroids.slice(0, visibleCount).map((polaroid, index) => (
            <PolaroidCard
              key={polaroid.src}
              polaroid={polaroid}
              index={index}
              isVisible={isVisible}
              pickZ={pickZMap[index] ?? 0}
              onPick={() => {
                setPickCounter((c) => {
                  const next = c + 1;
                  setPickZMap((m) => ({ ...m, [index]: next }));
                  return next;
                });
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

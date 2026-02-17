"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimationControls,
  type PanInfo,
  AnimatePresence,
} from "framer-motion";
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

/* ─── Polaroid frame (shared between mobile & desktop) ─── */
function PolaroidFrame({
  polaroid,
  index,
  className,
}: {
  polaroid: Polaroid;
  index: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm p-2 pb-10 sm:p-3 sm:pb-12 border border-white/40 ${className ?? ""}`}
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
        {/* Light leak */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
          style={{
            background: `linear-gradient(${130 + index * 15}deg, rgba(252,202,70,0.6) 0%, rgba(255,120,80,0.4) 30%, transparent 60%)`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Desktop: spread polaroids with hover ─── */
const hoverSpring = { type: "spring" as const, stiffness: 120, damping: 16 };

function PolaroidCard({
  polaroid,
  index,
  isVisible,
  pickZ,
  onPick,
  hoveredIndex,
  onHover,
  onLeave,
}: {
  polaroid: Polaroid;
  index: number;
  isVisible: boolean;
  pickZ: number;
  onPick: () => void;
  hoveredIndex: number | null;
  onHover: () => void;
  onLeave: () => void;
}) {
  const controls = useAnimationControls();
  const hasEntered = useRef(false);

  useEffect(() => {
    if (isVisible && !hasEntered.current) {
      hasEntered.current = true;
      controls.start({
        opacity: 1,
        x: 0,
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

  useEffect(() => {
    if (!hasEntered.current) return;

    const isMe = hoveredIndex === index;
    const spread = 50;

    let x = 0;
    if (hoveredIndex !== null && !isMe) {
      if (index === hoveredIndex - 1) x = -spread;
      else if (index === hoveredIndex + 1) x = spread;
    }

    controls.start({
      x,
      rotate: isMe ? polaroid.rotate * 0.3 : polaroid.rotate,
      scale: isMe ? 1.05 : 1,
      y: isMe ? polaroid.yOffset - 10 : polaroid.yOffset,
      transition: hoverSpring,
    });
  }, [hoveredIndex, controls, polaroid, index]);

  return (
    <motion.div
      className="relative shrink-0 cursor-pointer"
      initial={{ opacity: 0, y: 40, rotate: 0, x: 0 }}
      animate={controls}
      onHoverStart={() => {
        onPick();
        onHover();
      }}
      onHoverEnd={onLeave}
      style={{ zIndex: pickZ || index }}
    >
      <PolaroidFrame
        polaroid={polaroid}
        index={index}
        className="transition-shadow duration-500 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_30px_rgba(0,0,0,0.45)]"
      />
    </motion.div>
  );
}

/* ─── Mobile: swipeable stack ─── */
const SWIPE_THRESHOLD = 80;

function MobileStack({
  polaroids,
  isVisible,
}: {
  polaroids: Polaroid[];
  isVisible: boolean;
}) {
  const [stack, setStack] = useState<number[]>([]);

  useEffect(() => {
    setStack(polaroids.map((_, i) => i));
  }, [polaroids]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      // Move top card to bottom of stack
      setStack((prev) => {
        const [top, ...rest] = prev;
        return [...rest, top];
      });
    }
  };

  if (stack.length === 0) return null;

  // Show top 3 cards from the stack
  const visibleStack = stack.slice(0, 3);

  return (
    <div className="relative flex items-center justify-center h-80">
      <AnimatePresence>
        {visibleStack.map((cardIndex, depth) => {
          const polaroid = polaroids[cardIndex];
          const isTop = depth === 0;

          return (
            <motion.div
              key={polaroid.src}
              className="absolute cursor-grab active:cursor-grabbing"
              initial={
                isVisible
                  ? { opacity: 0, scale: 0.8, y: 60 }
                  : { opacity: 0 }
              }
              animate={{
                opacity: 1,
                scale: 1 - depth * 0.05,
                y: depth * 8,
                rotate: polaroid.rotate * (isTop ? 1 : 0.5),
              }}
              exit={{
                x: 300,
                opacity: 0,
                rotate: 20,
                transition: { duration: 0.3 },
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              style={{ zIndex: 10 - depth }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={isTop ? handleDragEnd : undefined}
            >
              <PolaroidFrame polaroid={polaroid} index={cardIndex} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Swipe hint */}
      <motion.div
        className="absolute -bottom-2 flex items-center gap-3 text-cream/30"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <motion.svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          animate={{ x: [-3, 0, -3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <polyline points="15 18 9 12 15 6" />
        </motion.svg>
        <motion.div
          className="w-8 h-0.5 rounded-full bg-cream/20"
          animate={{ scaleX: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        <motion.svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          animate={{ x: [3, 0, 3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <polyline points="9 18 15 12 9 6" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

/* ─── Main component ─── */
export function FriendsCarousel() {
  const { ref, isVisible } = useIntersectionTrigger({ threshold: 0.15 });
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const [pickCounter, setPickCounter] = useState(slides.length);
  const [pickZMap, setPickZMap] = useState<Record<number, number>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [desktopCount, setDesktopCount] = useState(5);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setPolaroids(
      shuffle(slides).map((slide) => ({
        ...slide,
        rotate: randomBetween(-8, 8),
        yOffset: randomBetween(-14, 14),
      }))
    );

    function updateLayout() {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      if (w < 1024) setDesktopCount(4);
      else setDesktopCount(5);
    }
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
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
        {isMobile ? (
          <MobileStack polaroids={polaroids} isVisible={isVisible} />
        ) : (
          <div className="flex items-center justify-center -space-x-8 lg:-space-x-10">
            {polaroids.slice(0, desktopCount).map((polaroid, index) => (
              <PolaroidCard
                key={polaroid.src}
                polaroid={polaroid}
                index={index}
                isVisible={isVisible}
                pickZ={pickZMap[index] ?? 0}
                hoveredIndex={hoveredIndex}
                onPick={() => {
                  setPickCounter((c) => {
                    const next = c + 1;
                    setPickZMap((m) => ({ ...m, [index]: next }));
                    return next;
                  });
                }}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

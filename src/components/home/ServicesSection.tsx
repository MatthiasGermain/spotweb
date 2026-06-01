"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "next-view-transitions";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui";
import { SERVICE_NAMES as services, SUB_SERVICES as subServices } from "@/constants";

const GLOW_COLOR = "98, 143, 147";

/* ── Bento layout ── */
const getBentoConfig = (count: number): { cols: number; spans: (number | undefined)[] } => {
  if (count === 6) {
    return { cols: 3, spans: [2, undefined, undefined, undefined, undefined, 3] };
  }
  if (count % 2 !== 0) {
    return { cols: 2, spans: [2, ...Array(count - 1).fill(undefined)] };
  }
  return { cols: 2, spans: Array(count).fill(undefined) };
};

export function ServicesSection() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && !hasTriggered) {
      const timer = setTimeout(() => {
        setActiveService("STRATÉGIE");
        setHasTriggered(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasTriggered]);

  // Border glow — track mouse across all cards
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = grid.querySelectorAll(".service-card");
      cards.forEach((card) => {
        const el = card as HTMLElement;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Distance from card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(rect.width, rect.height) / 2;
        const effective = Math.max(0, dist);

        let intensity = 0;
        if (effective <= 0) intensity = 1;
        else if (effective <= 150) intensity = 1 - effective / 150;

        el.style.setProperty("--glow-x", `${x}%`);
        el.style.setProperty("--glow-y", `${y}%`);
        el.style.setProperty("--glow-intensity", intensity.toString());
      });
    };

    const handleMouseLeave = () => {
      const cards = grid.querySelectorAll(".service-card");
      cards.forEach((card) => {
        (card as HTMLElement).style.setProperty("--glow-intensity", "0");
      });
    };

    grid.addEventListener("mousemove", handleMouseMove);
    grid.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      grid.removeEventListener("mousemove", handleMouseMove);
      grid.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeService]);

  const handleClick = (service: string) => {
    setActiveService(activeService === service ? null : service);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sunglow py-12 sm:py-16 lg:py-20"
    >
      <style>{`
        .service-card {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
        }

        .service-card::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 4px;
          background: radial-gradient(
            250px circle at var(--glow-x) var(--glow-y),
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.7)) 0%,
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.3)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .service-card:hover {
          box-shadow: 0 4px 20px rgba(${GLOW_COLOR}, 0.15), 0 0 20px rgba(${GLOW_COLOR}, 0.08);
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-right font-montserrat text-4xl font-black text-white sm:mb-12 sm:text-5xl lg:text-6xl xl:text-7xl">
          NOS SERVICES
        </h2>

        <div className="relative mb-8 flex flex-col gap-8 sm:mb-12 sm:flex-row sm:justify-between">
          {/* Services list */}
          <ul className="space-y-1 sm:space-y-4 lg:space-y-6">
            {services.map((service) => {
              const isActive = activeService === service;
              return (
                <li key={service}>
                  <button
                    onClick={() => handleClick(service)}
                    className={`relative font-montserrat text-xl transition-all duration-300 hover:-translate-y-1 sm:text-2xl md:text-3xl lg:text-4xl ${
                      isActive
                        ? "translate-x-2 font-bold text-raisin sm:translate-x-4"
                        : "font-light text-white"
                    }`}
                  >
                    <span className="relative z-10">{service}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-1.5 bg-white transition-all duration-300 sm:h-2 md:h-3 lg:h-4 ${
                        isActive ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                      style={{
                        marginLeft: "0.5rem",
                        width: isActive ? "calc(100% + 0.5rem)" : "0",
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sub-services bento grid — Desktop */}
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <div
              ref={gridRef}
              className="relative h-85 w-85 md:h-95 md:w-95 lg:h-110 lg:w-110 xl:h-130 xl:w-130"
            >
              <AnimatePresence mode="wait">
                {activeService && (
                  <motion.div
                    key={activeService}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`absolute inset-x-0 top-0 grid gap-4 lg:gap-5 ${
                      getBentoConfig(subServices[activeService].length).cols === 3
                        ? "grid-cols-3"
                        : "grid-cols-2"
                    }`}
                  >
                    {(() => {
                      const items = subServices[activeService];
                      const { spans } = getBentoConfig(items.length);
                      return items.map((subService, index) => (
                        <div
                          key={subService}
                          className={`service-card group relative flex cursor-default items-center justify-center overflow-hidden rounded-2xl bg-cream p-4 text-center transition-shadow duration-300 ${
                            spans[index] === 3
                              ? "col-span-3 py-8"
                              : spans[index] === 2
                                ? "col-span-2 py-8"
                                : "aspect-square"
                          }`}
                        >
                          <span className="absolute top-3 left-4 font-avenir text-xs font-light text-cyan/40 lg:text-sm">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="relative z-10 font-montserrat text-sm font-bold uppercase tracking-wide text-raisin transition-colors duration-300 group-hover:text-cyan md:text-base lg:text-xl">
                            {subService}
                          </span>
                        </div>
                      ));
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sub-services grid — Mobile */}
          <div className="relative h-85 sm:hidden">
            <AnimatePresence mode="wait">
              {activeService && (
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`absolute inset-x-0 top-0 grid gap-3 ${
                    getBentoConfig(subServices[activeService].length).cols === 3
                      ? "grid-cols-3"
                      : "grid-cols-2"
                  }`}
                >
                  {(() => {
                    const items = subServices[activeService];
                    const { spans } = getBentoConfig(items.length);
                    return items.map((subService, index) => (
                      <div
                        key={subService}
                        className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-cream p-3 text-center shadow-sm ${
                          spans[index] === 3
                            ? "col-span-3 py-5"
                            : spans[index] === 2
                              ? "col-span-2 py-5"
                              : "aspect-square"
                        }`}
                      >
                        <span className="absolute top-2 left-3 font-avenir text-xs font-light text-cyan/40">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-montserrat text-sm font-bold uppercase tracking-wide text-raisin">
                          {subService}
                        </span>
                      </div>
                    ));
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link href="/services">
            <Button colorScheme="white" size="lg">
              Mettre en lumière
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useIntersectionTrigger } from "@/hooks";
import { SERVICES } from "@/constants";

const GLOW_COLOR = "252, 202, 70"; // sunglow

export function ServicesOverview() {
  const { ref, isVisible } = useIntersectionTrigger<HTMLDivElement>({ threshold: 0.15 });
  const gridRef = useRef<HTMLDivElement>(null);

  // Border glow — suit la souris sur l'ensemble des cartes
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e: MouseEvent) => {
      grid.querySelectorAll<HTMLElement>(".service-card").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(rect.width, rect.height) / 2;
        const effective = Math.max(0, dist);

        let intensity = 0;
        if (effective <= 0) intensity = 1;
        else if (effective <= 180) intensity = 1 - effective / 180;

        el.style.setProperty("--glow-x", `${x}%`);
        el.style.setProperty("--glow-y", `${y}%`);
        el.style.setProperty("--glow-intensity", intensity.toString());
      });
    };

    const handleMouseLeave = () => {
      grid.querySelectorAll<HTMLElement>(".service-card").forEach((el) => {
        el.style.setProperty("--glow-intensity", "0");
      });
    };

    grid.addEventListener("mousemove", handleMouseMove);
    grid.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      grid.removeEventListener("mousemove", handleMouseMove);
      grid.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="bg-cream pb-16 sm:pb-20 lg:pb-28">
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
          padding: 2px;
          background: radial-gradient(
            300px circle at var(--glow-x) var(--glow-y),
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
          z-index: 1;
        }
        .service-card:hover {
          box-shadow: 0 8px 30px rgba(${GLOW_COLOR}, 0.18), 0 0 20px rgba(${GLOW_COLOR}, 0.08);
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
        >
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              ref={index === 0 ? ref : undefined}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.08,
              }}
              className="service-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-raisin p-8 transition-shadow duration-300 lg:p-10"
            >
              <span className="font-avenir text-sm font-light text-sunglow/70">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h2 className="mt-3 font-avenir text-2xl font-black uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-sunglow sm:text-3xl">
                {service.title}
              </h2>

              <p className="mt-4 font-montserrat text-sm leading-relaxed text-white/70 sm:text-base">
                {service.description}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {service.subServices.map((sub) => (
                  <li
                    key={sub}
                    className="rounded-full bg-white/10 px-3 py-1 font-montserrat text-xs font-medium text-white/80"
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

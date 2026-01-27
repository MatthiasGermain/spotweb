"use client";

import { useEffect, useRef, useState } from "react";

export function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sunglow py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtitle */}
        <p className="mb-6 sm:text-3xl lg:text-4xl font-semibold uppercase tracking-widest text-white">
          Contact
        </p>

        {/* Main title */}
        <h1 className="mb-10 text-4xl font-black tracking-tight text-raisin sm:text-6xl lg:text-7xl">
          <span
            className="inline px-2 sm:px-4"
            style={{
              background: "linear-gradient(var(--color-white), var(--color-white)) no-repeat 0 85%",
              backgroundSize: isVisible ? "100% 0.35em" : "0% 0.35em",
              transition: "background-size 0.8s ease-out",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            METTRE EN LUMIÈRE
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-white sm:text-lg">
          Spotlight vous accompagne pour mettre en lumière vos projets et vos actions.
          Nous croyons qu&apos;une communication juste et inspirée peut servir votre vision et porter votre impact.
          Partagez avec nous vos besoins, vos objectifs et vos échéances : ensemble, nous construirons une stratégie alignée avec vos valeurs
          pour donner à votre message clarté, portée et sens.
        </p>
      </div>
    </section>
  );
}

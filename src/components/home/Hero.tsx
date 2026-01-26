"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function Hero() {
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
      className="relative overflow-hidden bg-cream py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tight text-raisin sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="text-violet font-normal">Mettre en</span>{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1e2952]">LUMIÈRE</span>
              <span
                className="absolute bottom-1 left-0 -z-0 h-5 w-full origin-left bg-sunglow transition-transform duration-700 ease-out sm:h-6 lg:h-7 xl:h-8"
                style={{
                  transform: isVisible ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: "0ms",
                }}
              />
            </span>
            <br />
            <span>
              <span className="text-violet font-normal">ce qui</span>{" "}
              <span
                className="text-[#1e2952]"
                style={{
                  background: "linear-gradient(var(--color-sunglow), var(--color-sunglow)) no-repeat 0 90%",
                  backgroundSize: isVisible ? "100% 0.35em" : "0% 0.35em",
                  transition: "background-size 1s ease-out",
                  transitionDelay: "200ms",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                COMPTE{" "}
                <span className="whitespace-nowrap">VRAIMENT{"\u00A0"}!</span>
              </span>
            </span>
          </h1>
        </div>
      </div>

      {/* Decorative flame/candle on the right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-100 sm:right-24 lg:right-64 xl:right-80">
        <Image
          src="/images/decorations/picto_candle.svg"
          alt=""
          width={352}
          height={448}
          className="h-80 w-auto sm:h-[26rem] lg:h-[32rem]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

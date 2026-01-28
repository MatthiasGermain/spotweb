"use client";

import Image from "next/image";
import { AnimatedUnderlineText } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";
import { DELAY } from "@/constants";

export function Hero() {
  const { ref: sectionRef, isVisible } = useIntersectionTrigger<HTMLElement>({
    threshold: 0.3,
  });

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
              <AnimatedUnderlineText
                isVisible={isVisible}
                delay={DELAY.medium}
                className="text-[#1e2952]"
              >
                COMPTE{" "}
                <span className="whitespace-nowrap">VRAIMENT{"\u00A0"}!</span>
              </AnimatedUnderlineText>
            </span>
          </h1>
        </div>
      </div>

      {/* Decorative flame/candle on the right */}
      <div className="absolute top-1/2 -translate-y-1/4 sm:-translate-y-1/5 md:-translate-y-2/10 lg:-translate-y-3/10 -right-16 sm:-right-6 md:right-8 lg:right-12 xl:right-24 2xl:right-32">
        <Image
          src="/images/decorations/picto_candle.svg"
          alt=""
          width={352}
          height={448}
          className="h-64 w-auto sm:h-80 md:h-96 lg:h-112 xl:h-128"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

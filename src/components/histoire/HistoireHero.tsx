"use client";

import Image from "next/image";
import { AnimatedUnderlineText, TeamCollage } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";
import { DELAY } from "@/constants";

export function HistoireHero() {
  const { ref: collageRef, isVisible: isInView } = useIntersectionTrigger<HTMLDivElement>({
    threshold: 0.3,
    rootMargin: "-100px",
  });
  const { ref: titleRef, isVisible: isTitleInView } = useIntersectionTrigger<HTMLDivElement>({
    threshold: 0.3,
    rootMargin: "-50px",
  });

  return (
    <section className="relative bg-cream py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Decorative striped circle - top left */}
      <div className="absolute -left-16 -top-16 sm:-left-12 sm:-top-12 lg:-left-8 lg:-top-8">
        <Image
          src="/images/decorations/zebra-striped round.svg"
          alt=""
          width={1800}
          height={1800}
          className="h-64 w-64 sm:h-60 sm:w-60 lg:h-72 lg:w-72 opacity-100"
          aria-hidden="true"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* Left side - Title */}
          <div ref={titleRef} className="mt-30 lg:mt-30 relative flex flex-col items-start lg:w-1/3">
            <h1 className="font-avenir font-black text-[#1e2952] text-5xl sm:text-7xl lg:text-8xl xl:text-[6rem]">
              <AnimatedUnderlineText isVisible={isTitleInView}>
                NOTRE
              </AnimatedUnderlineText>
              <br />
              <AnimatedUnderlineText isVisible={isTitleInView} delay={DELAY.medium}>
                HISTOIRE
              </AnimatedUnderlineText>
            </h1>
          </div>

          {/* Right side - Team photos collage */}
          <div ref={collageRef}>
            <TeamCollage isVisible={isInView} />
          </div>
        </div>
      </div>
    </section>
  );
}

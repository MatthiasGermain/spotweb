"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const teamPhotos = [
  {
    name: "Juliette",
    image: "/images/team/juliette.png",
    position: "left-0 top-8 z-10 sm:left-4 sm:top-12 lg:left-8 lg:top-14",
    slideFrom: { x: -100, y: 0 }, // from left
  },
  {
    name: "Guillaume",
    image: "/images/team/guillaume.png",
    position: "left-20 top-2 z-20 sm:left-40 sm:top-2 lg:left-56 lg:top-2",
    slideFrom: { x: 0, y: -100 }, // from top
  },
  {
    name: "Matthias",
    image: "/images/team/matthias.png",
    position: "left-40 top-4 z-10 sm:left-76 sm:top-4 lg:left-104 lg:top-4",
    slideFrom: { x: 100, y: 0 }, // from right
  },
  {
    name: "Faneva",
    image: "/images/team/faneva.png",
    position: "left-4 top-32 z-30 sm:left-16 sm:top-48 lg:left-24 lg:top-56",
    slideFrom: { x: -100, y: 50 }, // from bottom-left
  },
  {
    name: "Richa",
    image: "/images/team/richa.png",
    position: "left-28 top-24 z-20 sm:left-52 sm:top-40 lg:left-72 lg:top-44",
    slideFrom: { x: 0, y: 100 }, // from bottom
  },
  {
    name: "Teddy",
    image: "/images/team/teddy.png",
    position: "left-52 top-28 z-10 sm:left-88 sm:top-44 lg:left-120 lg:top-50",
    slideFrom: { x: 100, y: 50 }, // from bottom-right
  },
];

export function HistorySection() {
  const collageRef = useRef(null);
  const isInView = useInView(collageRef, { once: true, margin: "-100px" });

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
          {/* Left side - Title and button */}
          <div className="mt-30 lg:mt-30 relative flex flex-col items-start lg:w-1/3">
            <h2 className="font-avenir font-black text-[#1e2952] text-5xl sm:text-7xl lg:text-8xl xl:text-[6rem]">
              <span className="relative inline-block">
                <span className="relative z-10">NOTRE</span>
                <span
                  className="absolute bottom-1 left-0 z-0 h-3 bg-sunglow sm:h-4 lg:h-5"
                  style={{ width: "calc(100% + 0.5rem)", marginLeft: "-0.25rem" }}
                />
              </span>
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">HISTOIRE</span>
                <span
                  className="absolute bottom-1 left-0 z-0 h-3 bg-sunglow sm:h-4 lg:h-5"
                  style={{ width: "calc(100% + 0.5rem)", marginLeft: "-0.25rem" }}
                />
              </span>
            </h2>

            <span className="group relative mx-auto mt-6 inline-block sm:mt-8">
              {/* Shadow */}
              <span className="absolute inset-0 translate-x-1 translate-y-1 rounded-full bg-sunglow transition-transform duration-200 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
              <Link
                href="/about"
                className="relative z-10 block rounded-full bg-violet px-6 py-2 font-montserrat text-sm text-white transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 sm:px-8 sm:py-3 sm:text-base"
              >
                en savoir plus...
              </Link>
            </span>
          </div>

          {/* Right side - Team photos collage */}
          <div
            ref={collageRef}
            className="relative mx-auto h-72 w-72 sm:h-100 sm:w-140 lg:mx-0 lg:ml-auto lg:h-120 lg:w-180"
          >
            {teamPhotos.map((photo, index) => (
              <motion.div
                key={photo.name}
                initial={{
                  x: photo.slideFrom.x,
                  y: photo.slideFrom.y,
                  opacity: 0
                }}
                animate={isInView ? {
                  x: 0,
                  y: 0,
                  opacity: 1
                } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`absolute w-24 sm:w-40 lg:w-52 ${photo.position}`}
              >
                <Image
                  src={photo.image}
                  alt={photo.name}
                  width={300}
                  height={400}
                  className="h-auto w-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

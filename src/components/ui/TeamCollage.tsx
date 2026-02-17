"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const teamPhotos = [
  {
    name: "Juliette",
    image: "/images/team/juliette.png",
    position: "left-0 top-8 z-10 sm:left-4 sm:top-12 lg:left-8 lg:top-14",
    slideFrom: { x: -100, y: 0 },
  },
  {
    name: "Guillaume",
    image: "/images/team/guillaume.png",
    position: "left-20 top-2 z-20 sm:left-40 sm:top-2 lg:left-56 lg:top-2",
    slideFrom: { x: 0, y: -100 },
  },
  {
    name: "Matthias",
    image: "/images/team/matthias.png",
    position: "left-40 top-4 z-10 sm:left-76 sm:top-4 lg:left-104 lg:top-4",
    slideFrom: { x: 100, y: 0 },
  },
  {
    name: "Faneva",
    image: "/images/team/faneva.png",
    position: "left-4 top-32 z-30 sm:left-16 sm:top-48 lg:left-24 lg:top-56",
    slideFrom: { x: -100, y: 50 },
  },
  {
    name: "Richa",
    image: "/images/team/richa.png",
    position: "left-28 top-24 z-20 sm:left-52 sm:top-40 lg:left-72 lg:top-44",
    slideFrom: { x: 0, y: 100 },
  },
  {
    name: "Teddy",
    image: "/images/team/teddy.png",
    position: "left-52 top-28 z-10 sm:left-88 sm:top-44 lg:left-120 lg:top-50",
    slideFrom: { x: 100, y: 50 },
  },
];

interface TeamCollageProps {
  isVisible: boolean;
}

export function TeamCollage({ isVisible }: TeamCollageProps) {
  return (
    <div className="relative mx-auto h-72 w-72 sm:h-100 sm:w-140 lg:mx-0 lg:ml-auto lg:h-120 lg:w-180">
      {teamPhotos.map((photo, index) => (
        <motion.div
          key={photo.name}
          initial={{
            x: photo.slideFrom.x,
            y: photo.slideFrom.y,
            opacity: 0,
          }}
          animate={
            isVisible
              ? { x: 0, y: 0, opacity: 1 }
              : {}
          }
          transition={{
            duration: 0.6,
            delay: index * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
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
  );
}

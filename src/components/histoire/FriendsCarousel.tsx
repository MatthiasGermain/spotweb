"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";

const slides = [
  { src: "/images/team/fun1.jpg", alt: "L'équipe Spotlight sur le canapé", width: 600, height: 900 },
  { src: "/images/team/fun2.jpg", alt: "Duo complice", width: 600, height: 900 },
  { src: "/images/team/fun3.jpg", alt: "L'équipe en mode fun", width: 600, height: 900 },
  { src: "/images/team/fun4.jpg", alt: "L'équipe Spotlight pose", width: 900, height: 900 },
  { src: "/images/team/fun5.jpg", alt: "L'équipe Spotlight", width: 600, height: 900 },
  { src: "/images/team/fun6.jpg", alt: "L'équipe Spotlight", width: 600, height: 900 },
  { src: "/images/team/fun7.jpg", alt: "L'équipe Spotlight", width: 600, height: 900 },
];

export function FriendsCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    [AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  return (
    <section className="overflow-hidden bg-raisin">
      {/* Banner */}
      <div className="bg-raisin py-3 sm:py-4">
        <h2 className="text-left font-avenir font-black text-sunglow text-lg py-4 sm:pl-16 sm:text-3xl lg:text-5xl tracking-wide uppercase">
          Avant tout, une bande d&apos;amis...
        </h2>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden pb-16 cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.src} className="group shrink-0 pl-4 h-75 sm:h-100 lg:h-125">
              <div
                className="h-full rounded-lg overflow-hidden"
                style={{ aspectRatio: `${slide.width} / ${slide.height}` }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

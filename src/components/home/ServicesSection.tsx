"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useInView } from "framer-motion";
import { Button } from "@/components/ui";

const services = [
  "CONSEIL",
  "GRAPHISME",
  "SITE WEB",
  "VIDÉO",
  "MOTION DESIGN",
  "COMMUNITY",
  "CROSSFUNDING",
];

const subServices: Record<string, string[]> = {
  CONSEIL: ["service 1", "service 2", "service 3", "service 4"],
  GRAPHISME: ["Identité visuelle", "Affiche", "Flyer", "Brochure"],
  "SITE WEB": ["service 1", "service 2", "service 3", "service 4"],
  VIDÉO: ["service 1", "service 2", "service 3", "service 4"],
  "MOTION DESIGN": ["service 1", "service 2", "service 3", "service 4"],
  COMMUNITY: ["service 1", "service 2", "service 3", "service 4"],
  CROSSFUNDING: ["service 1", "service 2", "service 3", "service 4"],
};

const serviceImages: Record<string, string> = {
  CONSEIL: "/images/decorations/light_bulb.png",
  GRAPHISME: "/images/decorations/hand_with_pen.png",
  "SITE WEB": "/images/decorations/computer.png",
  VIDÉO: "/images/decorations/camera.png",
};

export function ServicesSection() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && !hasTriggered) {
      // Petit délai pour que l'animation soit visible
      const timer = setTimeout(() => {
        setActiveService("CONSEIL");
        setHasTriggered(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasTriggered]);

  const handleClick = (service: string) => {
    setActiveService(activeService === service ? null : service);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-sunglow py-12 sm:py-16 lg:py-20">
      {/* Service illustration - bottom right, overflowing */}
      {activeService && serviceImages[activeService] && (
        <div className="pointer-events-none absolute -bottom-32 right-0 hidden sm:block md:-bottom-40 md:right-8 lg:-bottom-48 lg:right-16">
          <Image
            src={serviceImages[activeService]}
            alt=""
            width={1000}
            height={1000}
            className="h-96 w-auto opacity-50 md:h-128 lg:h-160 xl:h-192"
            aria-hidden="true"
          />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title - top right */}
        <h2 className="mb-8 text-right font-montserrat text-4xl font-semibold text-white sm:mb-12 sm:text-5xl lg:text-6xl xl:text-7xl">
          NOS SERVICES
        </h2>

        {/* Content - Services list + Sub-services */}
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
                      isActive ? "translate-x-2 font-bold text-raisin sm:translate-x-4" : "font-light text-white"
                    }`}
                  >
                    <span className="relative z-10">{service}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-1.5 bg-white transition-all duration-300 sm:h-2 md:h-3 lg:h-4 ${
                        isActive ? "w-full opacity-100" : "w-0 opacity-0"
                      }`}
                      style={{ marginLeft: "0.5rem", width: isActive ? "calc(100% + 0.5rem)" : "0" }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sub-services grid - Desktop */}
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            {activeService && (
              <div className="w-85 md:w-95 lg:w-110 xl:w-130">
                <div className="grid grid-cols-2 gap-4 lg:gap-5">
                  {subServices[activeService]?.map((subService, index) => (
                    <div
                      key={subService}
                      className="flex aspect-square w-full items-center justify-center rounded-2xl bg-white p-3 text-center transition-all duration-300"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.4s ease-out ${index * 100}ms forwards`,
                      }}
                    >
                      <span className="font-montserrat text-sm font-semibold text-[#1e2952] md:text-base lg:text-lg">
                        {subService}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Sub-services grid - Mobile */}
          <div className="sm:hidden">
            {activeService && (
              <div className="grid grid-cols-2 gap-3">
                {subServices[activeService]?.map((subService, index) => (
                  <div
                    key={subService}
                    className="flex aspect-square w-full items-center justify-center rounded-2xl bg-white p-3 text-center transition-all duration-300"
                    style={{
                      opacity: 0,
                      animation: `fadeIn 0.4s ease-out ${index * 100}ms forwards`,
                    }}
                  >
                    <span className="font-montserrat text-sm font-semibold text-[#1e2952]">
                      {subService}
                    </span>
                  </div>
                ))}
              </div>
            )}
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

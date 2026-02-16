"use client";

import Image from "next/image";

export function ImagineScene() {
  return (
    <section className="bg-cyan py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12 lg:gap-16">
          {/* Image */}
          <div className="w-full sm:w-2/5 shrink-0">
            <div className="overflow-hidden rounded-2xl">
              {/* TODO: Remplacer par l'image définitive */}
              <Image
                src="/images/team/fun4.jpg"
                alt="L'équipe Spotlight autour d'une table"
                width={900}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Texte */}
          <div className="w-full sm:w-3/5">
            <h2 className="font-avenir font-black text-raisin text-3xl sm:text-4xl lg:text-5xl tracking-wide uppercase mb-6">
              Imaginez la
              <br />
              scène
            </h2>
            <p className="font-montserrat text-white text-base sm:text-lg lg:text-xl leading-relaxed">
              Quatre amis réunis autour d&apos;une table en train de discuter et
              de refaire le monde.{" "}
              <strong>
                On se rend alors compte de deux trucs essentiels...
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

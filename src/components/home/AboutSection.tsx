"use client";

import { useState } from "react";
import Image from "next/image";

export function AboutSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "EhAaAzNMY7U";

  return (
    <section className="bg-violet py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* YouTube Video */}
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-cream">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {isPlaying ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                title="C'est quoi Spotlight"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 h-full w-full cursor-pointer"
                aria-label="Lire la vidéo"
              >
                {/* Thumbnail */}
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt="C'est quoi Spotlight"
                  fill
                  className="object-cover"
                />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform hover:scale-110 sm:h-20 sm:w-20">
                    <svg
                      className="h-8 w-8 text-white sm:h-10 sm:w-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const animateStar = (star: HTMLElement) => {
  star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
  star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
  star.style.animation = "none";
  star.offsetHeight;
  star.style.animation = "";
};

export function ManifestoSection() {
  const magicRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!magicRef.current) return;
    const stars = magicRef.current.querySelectorAll<HTMLElement>(".magic-star");
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    stars.forEach((star, i) => {
      timeouts.push(
        setTimeout(() => {
          animateStar(star);
          intervals.push(setInterval(() => animateStar(star), 1000));
        }, i * 333)
      );
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, []);

  const starSvg = (
    <svg viewBox="0 0 512 512">
      <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
    </svg>
  );

  return (
    <section className="bg-cyan py-16 sm:py-20 lg:py-28">
      <style>{`
        @keyframes background-pan {
          from { background-position: 0% center; }
          to { background-position: -200% center; }
        }
        @keyframes star-scale {
          from, to { transform: scale(0); }
          50% { transform: scale(1); }
        }
        @keyframes star-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(180deg); }
        }
        .magic {
          position: relative;
        }
        .magic-star {
          --size: clamp(20px, 1.5vw, 30px);
          animation: star-scale 700ms ease forwards;
          display: block;
          height: var(--size);
          left: var(--star-left);
          position: absolute;
          top: var(--star-top);
          width: var(--size);
          pointer-events: none;
        }
        .magic-star > svg {
          animation: star-rotate 1000ms linear infinite;
          display: block;
          opacity: 0.7;
        }
        .magic-star > svg > path {
          fill: #FCCA46;
        }
        .magic-text {
          animation: background-pan 3s linear infinite;
          background: linear-gradient(
            to right,
            #FCCA46,
            #c9a0dc,
            #f4f0ec,
            #FCCA46
          );
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-8 sm:px-14 lg:px-18">
        <p className="font-avenir font-black text-2xl sm:text-3xl lg:text-5xl uppercase leading-snug tracking-wide">
          <span className="text-raisin">
            Parce que nous sommes convaincus qu&apos;
          </span><span className="magic" ref={magicRef}>
            <span className="magic-star">{starSvg}</span>
            <span className="magic-star">{starSvg}</span>
            <span className="magic-star">{starSvg}</span>
            <span className="magic-text">
              à l&apos;ère des médias et de la communication de masse,
              l&apos;Eglise peut et doit briller par une communication de
              qualité et à la portée de tous.
            </span>
          </span>
          <br />
          <span className="text-raisin">
            Nous voulons être ces serviteurs qui aident l&apos;Eglise à
            rejoindre le monde pour faire connaître l&apos;Evangile de Jésus.
          </span>
        </p>
      </div>
    </section>
  );
}

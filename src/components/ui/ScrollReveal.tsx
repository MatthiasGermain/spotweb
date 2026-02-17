"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  type ReactNode,
  type ReactElement,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

/**
 * Recursively walks React children, splitting text nodes into
 * individual `<span className="word">` elements while preserving
 * wrapper elements (and their className / style).
 */
let _keyCounter = 0;

function splitChildrenIntoWords(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];

  React.Children.forEach(children, (child, childIdx) => {
    if (child == null || typeof child === "boolean") return;

    // Plain text → split into words
    if (typeof child === "string" || typeof child === "number") {
      const text = String(child);
      text.split(/(\s+)/).forEach((segment, i) => {
        if (segment.match(/^\s+$/)) {
          result.push(segment);
        } else if (segment) {
          result.push(
            <span className="word inline-block" key={`w-${++_keyCounter}`}>
              {segment}
            </span>
          );
        }
      });
      return;
    }

    // React element → recurse into its children, keep wrapper
    if (React.isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode; className?: string }>;
      const innerWords = splitChildrenIntoWords(el.props.children);
      const key = el.key ?? `el-${childIdx}-${++_keyCounter}`;
      result.push(React.cloneElement(el, { ...el.props, key }, ...innerWords));
    }
  });

  return result;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const wordElements = useMemo(
    () => splitChildrenIntoWords(children),
    [children],
  );

  // Apply initial blur + opacity BEFORE first paint
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".word");
    words.forEach((w) => {
      w.style.opacity = String(baseOpacity);
      if (enableBlur) w.style.filter = `blur(${blurStrength}px)`;
    });
  }, [baseOpacity, enableBlur, blurStrength]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    // Rotation of the whole block
    const rotationTween = gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: rotationEnd,
          scrub: true,
        },
      }
    );
    if (rotationTween.scrollTrigger) triggers.push(rotationTween.scrollTrigger);

    const words = el.querySelectorAll<HTMLElement>(".word");

    // Animate opacity on scroll
    const opacityTween = gsap.to(words, {
      ease: "none",
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: wordAnimationEnd,
        scrub: true,
      },
    });
    if (opacityTween.scrollTrigger) triggers.push(opacityTween.scrollTrigger);

    // Animate blur on scroll
    if (enableBlur) {
      const blurTween = gsap.to(words, {
        ease: "none",
        filter: "blur(0px)",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: wordAnimationEnd,
          scrub: true,
        },
      });
      if (blurTween.scrollTrigger) triggers.push(blurTween.scrollTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <div className={textClassName}>{wordElements}</div>
    </div>
  );
};

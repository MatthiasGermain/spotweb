"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, LayoutGroup, useInView } from "framer-motion";

const teamMembers = [
  {
    name: "Guillaume",
    role: "Chargé de developpement",
    image: "/images/team/guillaume.jpg",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Matthias",
    role: "Développeur web",
    image: "/images/team/matthias.jpg",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Faneva",
    role: "Chargé de communication",
    image: "/images/team/faneva.jpg",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Teddy",
    role: "Vidéaste",
    image: "/images/team/teddy.jpg",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Richa",
    role: "Motion designer",
    image: "/images/team/richa.jpg",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "Juliette",
    role: "Graphiste",
    image: "/images/team/juliette.jpg",
    linkedin: "#",
    instagram: "#",
  },
];

interface TeamMemberCardProps {
  member: (typeof teamMembers)[0];
  isExpanded?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

function TeamMemberCard({ member, isExpanded, onToggle, isMobile }: TeamMemberCardProps) {
  return (
    <div
      className={`group relative overflow-hidden bg-white transition-all duration-300 aspect-4/5`}
      onClick={isMobile ? onToggle : undefined}
    >
      <Image
        src={member.image}
        alt={member.name}
        fill
        className="object-cover object-top transition-transform duration-300 sm:group-hover:scale-105"
      />
      {/* Mobile: tap to reveal info */}
      {isMobile && isExpanded && (
        <div className="absolute inset-x-0 bottom-0 bg-[#628f93] p-4 animate-slide-up">
          <p className="font-avenir text-lg font-bold text-white">{member.name}</p>
          <p className="font-montserrat text-sm font-medium text-white">{member.role}</p>
          <div className="mt-2 flex gap-3">
            <Link href={member.linkedin} className="text-white" onClick={(e) => e.stopPropagation()}>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link href={member.instagram} className="text-white" onClick={(e) => e.stopPropagation()}>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>
          </div>
        </div>
      )}
      {/* Desktop: hover overlay */}
      {!isMobile && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#628f93] p-4 transition-transform duration-300 group-hover:translate-y-0">
          <p className="font-avenir text-lg font-bold text-white md:text-xl">{member.name}</p>
          <p className="font-montserrat text-sm font-medium text-white">{member.role}</p>
          <div className="mt-2 flex gap-2">
            <Link href={member.linkedin} className="text-white transition-opacity hover:opacity-80">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link href={member.instagram} className="text-white transition-opacity hover:opacity-80">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function TeamSection() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && !hasTriggered) {
      // Petit délai pour que l'animation soit visible
      const timer = setTimeout(() => {
        setExpandedMember("Guillaume");
        setHasTriggered(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasTriggered]);

  const handleToggle = (memberName: string) => {
    setExpandedMember(expandedMember === memberName ? null : memberName);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title with violet underline */}
        <div className="mb-6 sm:mb-10 lg:mb-12">
          <h2 className="font-montserrat text-2xl font-bold text-[#1e2952] sm:text-4xl lg:text-5xl">
            <span className="relative inline-block">
              <span className="relative z-10">UNE ÉQUIPE CRÉATIVE</span>
              <span
                className="absolute bottom-0.5 left-0 z-0 h-1.5 bg-violet sm:bottom-1 sm:h-3 lg:h-4"
                style={{ width: "calc(100% + 1rem)", marginLeft: "-0.5rem" }}
              />
            </span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">ET CONNECTÉE</span>
              <span
                className="absolute bottom-0.5 left-0 z-0 h-1.5 bg-violet sm:bottom-1 sm:h-3 lg:h-4"
                style={{ width: "calc(100% + 1rem)", marginLeft: "-0.5rem" }}
              />
            </span>
          </h2>
        </div>

        {/* Mobile: tap to reveal - keeps natural order */}
        <div className="sm:hidden">
          <LayoutGroup>
            <div className="grid grid-cols-2 gap-3">
              {teamMembers.map((member, index) => {
                const isExpanded = member.name === expandedMember;
                const expandedIndex = expandedMember
                  ? teamMembers.findIndex((m) => m.name === expandedMember)
                  : -1;

                // When one card is expanded (col-span-2), one small card ends up alone
                // If expanded is at odd index (1,3,5): the card before it is alone
                // If expanded is at even index (0,2,4): card 5 is alone
                const isAloneOnRow =
                  expandedMember !== null &&
                  !isExpanded &&
                  ((expandedIndex % 2 === 1 && index === expandedIndex - 1) ||
                    (expandedIndex % 2 === 0 && index === 5));

                return (
                  <motion.div
                    key={member.name}
                    layout
                    transition={{
                      layout: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    className={`
                      ${isExpanded ? "col-span-2" : ""}
                      ${isAloneOnRow ? "col-span-2 flex justify-center" : ""}
                    `}
                  >
                    <motion.div
                      layout
                      className={isAloneOnRow ? "w-1/2" : "w-full"}
                    >
                      <TeamMemberCard
                        member={member}
                        isMobile={true}
                        isExpanded={isExpanded}
                        onToggle={() => handleToggle(member.name)}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        {/* Tablet+: two rows with offset - hover to reveal */}
        <div className="hidden space-y-6 sm:block lg:space-y-8">
          {/* Top row - offset right */}
          <div className="ml-8 grid grid-cols-3 gap-6 lg:ml-12 lg:gap-8">
            {teamMembers.slice(0, 3).map((member) => (
              <TeamMemberCard key={member.name} member={member} isMobile={false} />
            ))}
          </div>
          {/* Bottom row - offset left */}
          <div className="mr-8 grid grid-cols-3 gap-6 lg:mr-12 lg:gap-8">
            {teamMembers.slice(3, 6).map((member) => (
              <TeamMemberCard key={member.name} member={member} isMobile={false} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

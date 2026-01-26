"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Logo, StaggeredMenu } from "@/components/ui";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Notre histoire", href: "/notre-histoire" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/spotlight.crea/" },
  { label: "LinkedIn", link: "https://www.linkedin.com/company/spotlightcrea" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Only apply glassmorphism on desktop
  const showGlassEffect = isScrolled && isDesktop;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out bg-cream",
        showGlassEffect && "lg:bg-cream/70 lg:backdrop-blur-xl lg:shadow-lg lg:shadow-raisin/5 lg:border-b lg:border-white/20"
      )}
      style={{
        WebkitBackdropFilter: showGlassEffect ? "blur(20px) saturate(180%)" : "none",
        backdropFilter: showGlassEffect ? "blur(20px) saturate(180%)" : "none",
      }}
    >
      {/* Glass reflection effect - desktop only */}
      {showGlassEffect && (
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          }}
        />
      )}

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <StaggeredMenu
            items={navigation}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
          />
        </div>

        {/* Desktop navbar - left side */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-montserrat text-sm font-medium uppercase tracking-wide text-raisin transition-colors duration-200 hover:text-violet"
            >
              {item.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-sunglow transition-all duration-300",
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Logo - center */}
        <Link href="/" className="text-violet">
          <Logo className="w-32 h-auto sm:w-48" />
        </Link>

        {/* Desktop navbar - right side */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.slice(2).map((item) =>
            item.href === "/contact" ? (
              <Link key={item.href} href={item.href}>
                <Button variant="outline" size="md">
                  {item.label}
                </Button>
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-montserrat text-sm font-medium uppercase tracking-wide text-raisin transition-colors duration-200 hover:text-violet"
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-sunglow transition-all duration-300",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            )
          )}
        </nav>

        {/* Mobile spacer */}
        <div className="w-10 lg:hidden" />
      </div>
    </header>
  );
}

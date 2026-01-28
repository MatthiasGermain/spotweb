"use client";

import { useState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { Button, Logo, StaggeredMenu } from "@/components/ui";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, SOCIAL_ITEMS } from "@/constants";

const navigation = NAVIGATION_ITEMS;
const socialItems = SOCIAL_ITEMS;

// Theme config par page
const pageThemes: Record<string, { bg: string; text: string; logo: string; glass: string; underline: string }> = {
  "/contact": {
    bg: "bg-sunglow",
    text: "text-white",
    logo: "text-white",
    glass: "lg:bg-sunglow/80",
    underline: "bg-white",
  },
};

const defaultTheme = {
  bg: "bg-cream",
  text: "text-raisin",
  logo: "text-violet",
  glass: "lg:bg-cream/70",
  underline: "bg-sunglow",
};

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const theme = pageThemes[pathname] || defaultTheme;

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
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out",
        theme.bg,
        showGlassEffect && `${theme.glass} lg:backdrop-blur-xl lg:shadow-lg lg:shadow-raisin/5 lg:border-b lg:border-white/20`
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
        {/* Mobile spacer - left */}
        <div className="w-10 lg:hidden" />

        {/* Desktop navbar - left side */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative font-montserrat text-sm font-medium uppercase tracking-wide transition-colors duration-200 hover:opacity-70",
                theme.text
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                  theme.underline,
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Logo - center */}
        <Link href="/" className={theme.logo}>
          <Logo className="w-32 h-auto sm:w-48" />
        </Link>

        {/* Desktop navbar - right side */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.slice(2).map((item) =>
            item.href === "/contact" ? (
              <Link key={item.href} href={item.href}>
                <Button variant={pathname === "/contact" ? "light" : "outline"} size="md">
                  {item.label}
                </Button>
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative font-montserrat text-sm font-medium uppercase tracking-wide transition-colors duration-200 hover:opacity-70",
                  theme.text
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                    theme.underline,
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            )
          )}
        </nav>

        {/* Mobile menu button - right */}
        <div className="lg:hidden">
          <StaggeredMenu
            items={navigation}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            buttonColor={theme.text}
          />
        </div>
      </div>
    </header>
  );
}

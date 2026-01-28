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
    glass: "bg-sunglow/80",
    underline: "bg-white",
  },
};

const defaultTheme = {
  bg: "bg-cream",
  text: "text-raisin",
  logo: "text-violet",
  glass: "bg-cream/80",
  underline: "bg-sunglow",
};

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1920);

  const theme = pageThemes[pathname] || defaultTheme;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setViewportWidth(window.innerWidth);
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

  const showCompactHeader = isScrolled && isDesktop;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center lg:px-0">
      {/* Navbar container - continuous width animation */}
      <div
        className={cn(
          theme.bg,
          // Rounded corners when compact
          showCompactHeader && [
            "lg:rounded-full",
            "lg:border lg:border-white/20",
            theme.glass,
          ]
        )}
        style={{
          // Continuous width animation - using fixed pixel values for smooth CSS interpolation
          width: isDesktop ? (showCompactHeader ? "750px" : `${viewportWidth}px`) : "100%",
          marginTop: isDesktop && showCompactHeader ? "12px" : "0px",
          WebkitBackdropFilter: showCompactHeader ? "blur(20px) saturate(180%)" : undefined,
          backdropFilter: showCompactHeader ? "blur(20px) saturate(180%)" : undefined,
          boxShadow: showCompactHeader ? "0 10px 40px -10px rgba(30, 41, 82, 0.15)" : "none",
          transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1), margin-top 600ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 400ms ease-out, box-shadow 600ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms ease-out",
        }}
      >
        {/* Glass reflection effect */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none rounded-full overflow-hidden",
            "hidden lg:block"
          )}
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            opacity: showCompactHeader ? 1 : 0,
            transition: "opacity 500ms ease-out",
          }}
        />

        <div
          className="relative flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 mx-auto w-full"
          style={{
            // Animate gap between elements and max-width
            maxWidth: showCompactHeader ? "750px" : "1280px",
            gap: isDesktop ? (showCompactHeader ? "16px" : "32px") : undefined,
            transition: "max-width 600ms cubic-bezier(0.4, 0, 0.2, 1), gap 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Mobile spacer - left */}
          <div className="w-10 lg:hidden" />

          {/* Desktop navbar - left side */}
          <nav
            className="hidden lg:flex lg:items-center"
            style={{
              gap: showCompactHeader ? "12px" : "32px",
              transition: "gap 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative font-montserrat font-medium uppercase whitespace-nowrap hover:opacity-70",
                  theme.text
                )}
                style={{
                  fontSize: showCompactHeader ? "12px" : "14px",
                  letterSpacing: showCompactHeader ? "0.025em" : "0.05em",
                  transition: "font-size 600ms cubic-bezier(0.4, 0, 0.2, 1), letter-spacing 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
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

          {/* Logo - center with crossfade animation */}
          <Link href="/" className={cn(theme.logo, "relative shrink-0")}>
            {/* Mobile/Tablet: always full logo */}
            <Logo variant="full" className="w-36 h-auto sm:w-52 lg:hidden" />

            {/* Desktop: crossfade between logos */}
            <div
              className="hidden lg:block relative"
              style={{
                width: showCompactHeader ? "48px" : "240px",
                height: "56px",
                transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* Full logo */}
              <div
                className="absolute inset-0"
                style={{
                  opacity: showCompactHeader ? 0 : 1,
                  transform: showCompactHeader ? "scale(0.8)" : "scale(1)",
                  transition: "opacity 400ms ease-out, transform 400ms ease-out",
                }}
              >
                <Logo variant="full" className="w-full h-full object-contain" />
              </div>
              {/* Icon logo */}
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  opacity: showCompactHeader ? 1 : 0,
                  transform: showCompactHeader
                    ? "translate(-50%, -50%) scale(1)"
                    : "translate(-50%, -50%) scale(1.3)",
                  transition: "opacity 400ms ease-out 200ms, transform 400ms ease-out 200ms",
                }}
              >
                <Logo variant="icon" className="h-12 w-auto" />
              </div>
            </div>
          </Link>

          {/* Desktop navbar - right side */}
          <nav
            className="hidden lg:flex lg:items-center"
            style={{
              gap: showCompactHeader ? "12px" : "32px",
              transition: "gap 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {navigation.slice(2).map((item) =>
              item.href === "/contact" ? (
                <Link key={item.href} href={item.href}>
                  <Button
                    colorScheme="violet"
                    size={showCompactHeader ? "sm" : "md"}
                    className="whitespace-nowrap transition-all duration-500"
                  >
                    {item.label}
                  </Button>
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative font-montserrat font-medium uppercase whitespace-nowrap hover:opacity-70",
                    theme.text
                  )}
                  style={{
                    fontSize: showCompactHeader ? "12px" : "14px",
                    letterSpacing: showCompactHeader ? "0.025em" : "0.05em",
                    transition: "font-size 600ms cubic-bezier(0.4, 0, 0.2, 1), letter-spacing 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
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
      </div>
    </header>
  );
}

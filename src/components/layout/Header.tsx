"use client";

import { useState, useEffect, useRef } from "react";
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
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const theme = pageThemes[pathname] || defaultTheme;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (contentRef.current) {
        setContentWidth(contentRef.current.scrollWidth);
      }
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center lg:mx-8 xl:mx-0">
      {/* Navbar wrapper - full width for positioning */}
      <div
        className="relative w-full"
        style={{
          marginTop: isDesktop && showCompactHeader ? "8px" : "0px",
          transition: "margin-top 600ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Visual background - smaller width when compact, centered */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 h-full",
            theme.bg,
            showCompactHeader && [
              "lg:rounded-xl",
              "lg:border lg:border-white/20",
              theme.glass,
            ]
          )}
          style={{
            width: isDesktop ? (showCompactHeader && contentWidth ? `${contentWidth}px` : "100%") : "100%",
            WebkitBackdropFilter: showCompactHeader ? "blur(20px) saturate(180%)" : undefined,
            backdropFilter: showCompactHeader ? "blur(20px) saturate(180%)" : undefined,
            boxShadow: showCompactHeader ? "0 10px 40px -10px rgba(30, 41, 82, 0.15)" : "none",
            transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 400ms ease-out, box-shadow 600ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms ease-out",
          }}
        >
          {/* Glass reflection effect */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none rounded-xl overflow-hidden",
              "hidden lg:block"
            )}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
              opacity: showCompactHeader ? 1 : 0,
              transition: "opacity 500ms ease-out",
            }}
          />
        </div>

        {/* Content - maintains same position */}
        <div
          ref={contentRef}
          className="relative flex items-center justify-between px-4 py-2 sm:px-8 md:px-8 lg:px-8 xl:px-8 mx-auto w-full"
          style={{
            maxWidth: showCompactHeader ? "1240px" : "1280px",
            gap: isDesktop ? (showCompactHeader ? "28px" : "32px") : undefined,
            transition: "max-width 600ms cubic-bezier(0.4, 0, 0.2, 1), gap 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Mobile spacer - left (matches menu width for centering) */}
          <div className="flex-1 lg:hidden lg:flex-none" />

          {/* Desktop navbar - left side */}
          <nav
            className="hidden lg:flex lg:items-center"
            style={{
              gap: showCompactHeader ? "28px" : "32px",
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
                  fontSize: showCompactHeader ? "13px" : "14px",
                  letterSpacing: showCompactHeader ? "0.04em" : "0.05em",
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
              gap: showCompactHeader ? "28px" : "32px",
              transition: "gap 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {navigation.slice(2).map((item) =>
              item.href === "/contact" && pathname !== "/contact" ? (
                <Link key={item.href} href={item.href}>
                  <Button
                    colorScheme="violet"
                    size="md"
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
                    fontSize: showCompactHeader ? "13px" : "14px",
                    letterSpacing: showCompactHeader ? "0.04em" : "0.05em",
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
          <div className="flex-1 flex justify-end lg:hidden lg:flex-none">
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

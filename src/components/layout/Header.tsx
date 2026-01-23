"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, Logo } from "@/components/ui";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Notre histoire", href: "/notre-histoire" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function BurgerButton({ isOpen, onClick }: BurgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-10 w-10 p-2"
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
   
      {/* Main layer (violet) */}
      <div className="absolute inset-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
        <span
          className={cn(
            "absolute left-2 h-0.5 w-6 bg-violet transition-all duration-300",
            isOpen ? "top-4.5 rotate-45" : "top-2.5"
          )}
        />
        <span
          className={cn(
            "absolute left-2 top-4.5 h-0.5 w-6 bg-violet transition-all duration-300",
            isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
          )}
        />
        <span
          className={cn(
            "absolute left-2 h-0.5 w-6 bg-violet transition-all duration-300",
            isOpen ? "top-4.5 -rotate-45" : "top-6.5"
          )}
        />
      </div>
    </button>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full bg-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Menu burger - Mobile */}
        <div className="lg:hidden">
          <BurgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        {/* Menu burger - Desktop */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          <BurgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </nav>

        {/* Logo complet */}
        <Link href="/" className="text-violet">
          <Logo className="w-32 h-auto sm:w-48" />
        </Link>

        {/* Contact button (right) */}
        <div className="hidden sm:block">
          <Link href="/contact">
            <Button
              variant="outline"
              size="md"
              withShadow
            >
              Contact
            </Button>
          </Link>
        </div>

        {/* Mobile spacer */}
        <div className="w-10 sm:hidden" />
      </div>

      {/* Mobile/Desktop menu overlay */}
      <div
        className={cn(
          "fixed inset-0 top-18 z-40 bg-cream transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-1 p-6 sm:p-8">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative px-4 py-3 font-montserrat text-xl font-semibold text-[#1e2952] transition-all duration-300 hover:translate-x-2 sm:text-2xl"
              onClick={() => setIsMenuOpen(false)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="relative z-10">{item.name}</span>
              <span className="absolute bottom-2 left-4 h-1.5 w-0 bg-sunglow transition-all duration-300 group-hover:w-20 sm:h-2" />
            </Link>
          ))}
          <div className="mt-6 sm:hidden">
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-violet text-violet hover:bg-violet hover:text-white"
              >
                Contact
              </Button>
            </Link>
          </div>
        </nav>

        {/* Decorative element */}
        <div className="absolute bottom-8 right-8 h-32 w-32 rounded-full bg-sunglow/20" />
        <div className="absolute bottom-12 right-12 h-20 w-20 rounded-full bg-violet/20" />
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-18 z-30 bg-[#1e2952]/30 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}

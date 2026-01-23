import Link from "next/link";
import { Linkedin, Instagram } from "lucide-react";
import { Logo } from "@/components/ui";

const footerLinks = [
  { name: "accueil", href: "/" },
  { name: "notre histoire", href: "/notre-histoire" },
  { name: "services", href: "/services" },
];

export function Footer() {
  return (
    <footer className="bg-raisin text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section principale : Logo, Email, Icônes */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          {/* Logo */}
          <Link href="/" className="text-white">
            <Logo className="h-20 w-auto sm:h-24" />
          </Link>

          {/* Contact email */}
          <a
            href="mailto:contact@spotlightcrea.com"
            className="text-base text-white transition-colors hover:text-indigo"
          >
            contact@spotlightcrea.com
          </a>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors hover:text-indigo"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-8 w-8" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors hover:text-indigo"
              aria-label="Instagram"
            >
              <Instagram className="h-8 w-8" />
            </a>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-white/20" />

        {/* Section liens en bas */}
        <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
          <Link
            href="/mentions-legales"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            mentions légales
          </Link>
          <nav className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "next-view-transitions";
import { Linkedin, Instagram } from "lucide-react";
import { Logo } from "@/components/ui";
import { NAVIGATION_ITEMS, SOCIAL_LINKS, CONTACT_EMAIL } from "@/constants";

// Filter out contact from navigation for footer links
const footerLinks = NAVIGATION_ITEMS.filter(item => item.href !== "/contact").map(item => ({
  name: item.label.toLowerCase(),
  href: item.href
}));

export function Footer() {
  return (
    <footer className="bg-violet text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section principale : Logo, Email, Icônes */}
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row sm:items-end">
          {/* Logo */}
          <Link href="/" className="text-white translate-y-2">
            <Logo className="h-20 w-auto sm:h-24" />
          </Link>

          {/* Contact email */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-base text-white transition-colors hover:text-indigo"
          >
            {CONTACT_EMAIL}
          </a>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors hover:text-indigo"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-8 w-8" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
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

        {/* Copyright */}
        <div className="border-t border-white/10 py-4 text-center">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Spotlight. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { Header, Footer, Newsletter } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import { ContactHero, ContactForm } from "@/components/contact";

const description =
  "Votre message a quelque chose à dire. Contactez Spotlight pour qu'on l'éclaire, l'amplifie et le fasse rayonner.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Spotlight",
    description,
    url: "/contact",
  },
};

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col bg-sunglow">
      <Header />
      <main className="flex-1 pt-16 sm:pt-18">
        <ContactHero />
        <ContactForm />
      </main>
      <Newsletter theme="dark" />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

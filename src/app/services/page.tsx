import type { Metadata } from "next";
import { Header, Footer, Newsletter } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import { ServicesHero, ServicesOverview, ServicesCta } from "@/components/services";

const description =
  "Stratégie, graphisme, site web, vidéo, motion design et réseaux sociaux : découvrez tout ce que Spotlight peut faire pour mettre votre projet en lumière.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Spotlight",
    description,
    url: "/services",
  },
};

export default function Services() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 sm:pt-18">
        <ServicesHero />
        <ServicesOverview />
        <ServicesCta />
      </main>
      <Newsletter />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

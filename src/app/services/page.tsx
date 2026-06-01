import type { Metadata } from "next";
import { Header, Footer, Newsletter } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import { ServicesHero, ServicesOverview, ServicesCta } from "@/components/services";

export const metadata: Metadata = {
  title: "Services | Spotlight",
  description:
    "Stratégie, graphisme, site web, vidéo, motion design et réseaux sociaux : découvrez tout ce que Spotlight peut faire pour mettre votre projet en lumière.",
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

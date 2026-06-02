import type { Metadata } from "next";
import { Header, Footer, Newsletter } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import {
  HistoireHero,
  FriendsCarousel,
  ImagineScene,
  OriginsCards,
  BirthSection,
  ManifestoSection,
  CtaSection,
} from "@/components/histoire";

const description =
  "Découvrez l'histoire de Spotlight : la naissance de l'association, ses convictions et l'équipe qui met son énergie au service de la communication de l'Église.";

export const metadata: Metadata = {
  title: "Notre Histoire",
  description,
  alternates: { canonical: "/notre-histoire" },
  openGraph: {
    title: "Notre Histoire | Spotlight",
    description,
    url: "/notre-histoire",
  },
};

export default function NotreHistoire() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 sm:pt-18">
        <HistoireHero />
        <FriendsCarousel />
        <ImagineScene />
        <OriginsCards />
        <BirthSection />
        <ManifestoSection />
        <CtaSection />
      </main>
      <Newsletter />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

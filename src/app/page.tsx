import { Header, Footer, Newsletter } from "@/components/layout";
import { Hero } from "@/components/home/Hero";
import { PresentationBanner } from "@/components/home/PresentationBanner";
import { AboutSection } from "@/components/home/AboutSection";
import { HistorySection } from "@/components/home/HistorySection";
import { BeliefBanner } from "@/components/home/BeliefBanner";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TeamSection } from "@/components/home/TeamSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 sm:pt-18">
        <Hero />
        <PresentationBanner />
        <AboutSection />
        <HistorySection />
        <BeliefBanner />
        <ServicesSection />
        <TeamSection />
        <TestimonialsSection />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}

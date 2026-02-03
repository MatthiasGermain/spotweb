import { Header, Footer, Newsletter } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import { HistoireHero, FriendsCarousel } from "@/components/histoire";

export default function NotreHistoire() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 sm:pt-18">
        <HistoireHero />
        <FriendsCarousel />
      </main>
      <Newsletter />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

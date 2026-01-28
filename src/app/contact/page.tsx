import { Header, Footer, Newsletter } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import { ContactHero, ContactForm } from "@/components/contact";

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col">
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

import type { Metadata } from "next";
import { Header, Footer, Newsletter } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from "@/constants";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${SITE_NAME}.`,
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-avenir text-xl font-black uppercase tracking-wide text-raisin sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-3 font-montserrat text-sm leading-relaxed text-raisin/80 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function MentionsLegales() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cream pt-16 sm:pt-18">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-avenir text-4xl font-black uppercase tracking-wide text-raisin sm:text-5xl">
            Mentions légales
            <span className="mt-3 block h-2 w-24 bg-sunglow sm:h-3" />
          </h1>

          <Section title="Éditeur du site">
            <p>
              Le site Spotlight est édité par <strong>ExpresSon</strong>, structure porteuse du
              projet Spotlight.
            </p>
            <ul className="list-none space-y-1">
              <li>
                <strong>Siège social :</strong> 11 rue de l&apos;avant garde, 54340 Pompey, France
              </li>
              <li>
                <strong>SIREN :</strong> 511 125 767
              </li>
              <li>
                <strong>Email :</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-raisin underline hover:text-cyan">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <strong>Directeur / responsable de la publication :</strong> Thomas Hardy
              </li>
            </ul>
          </Section>

          <Section title="Hébergement">
            <p>Le site est hébergé par :</p>
            <ul className="list-none space-y-1">
              <li>
                <strong>Vercel Inc.</strong>
              </li>
              <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              <li>
                Site :{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-raisin underline hover:text-cyan"
                >
                  vercel.com
                </a>
              </li>
            </ul>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images, vidéos, logos,
              graphismes, charte visuelle) est, sauf mention contraire, la propriété de {SITE_NAME}{" "}
              ou de ses partenaires, et est protégé par les lois relatives à la propriété
              intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle,
              sans autorisation écrite préalable est interdite.
            </p>
          </Section>

          <Section title="Données personnelles">
            <p>
              Les informations transmises via le formulaire de contact et le formulaire d&apos;inscription
              à la newsletter sont utilisées uniquement pour répondre à vos demandes et vous tenir
              informé(e) des actualités de {SITE_NAME}. Elles ne sont ni revendues ni cédées à des
              tiers.
            </p>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
              « Informatique et Libertés », vous disposez d&apos;un droit d&apos;accès, de
              rectification et de suppression des données vous concernant. Pour l&apos;exercer,
              contactez-nous à l&apos;adresse{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-raisin underline hover:text-cyan">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p>
              Les données transmises sont conservées pour une durée maximale de 3 ans à compter de
              notre dernier contact, puis supprimées.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Ce site n&apos;utilise aucun cookie. Aucune donnée de navigation n&apos;est collectée
              à des fins de suivi ou de mesure d&apos;audience.
            </p>
          </Section>

          <Section title="Crédits">
            <p>Conception et développement : équipe Web et Graphisme de Spotlight.</p>
          </Section>

          <p className="mt-12 text-xs text-raisin/50">
            Document accessible à l&apos;adresse {SITE_URL}/mentions-legales.
          </p>
        </div>
      </main>
      <Newsletter />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

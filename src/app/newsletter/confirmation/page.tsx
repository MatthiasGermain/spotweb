import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ScrollToTop } from "@/components/ui";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: "Confirmation d'inscription",
  description: `Confirmation de votre inscription à la newsletter ${SITE_NAME}.`,
  robots: { index: false, follow: false },
};

type Status = "ok" | "already" | "expired" | "invalid" | "error";

const MESSAGES: Record<Status, { title: string; body: string }> = {
  ok: {
    title: "C'est confirmé !",
    body: "Ton inscription est validée, on est ravis de t'avoir avec nous. Un email de bienvenue vient de partir vers ta boîte mail.",
  },
  already: {
    title: "Tu es déjà des nôtres",
    body: "Cette adresse est déjà inscrite à la newsletter. Rien à faire de plus, tu recevras nos prochaines actus.",
  },
  expired: {
    title: "Ce lien a expiré",
    body: "Les liens de confirmation sont valables 48 heures. Inscris-toi à nouveau depuis le site et nous t'enverrons un nouveau lien.",
  },
  invalid: {
    title: "Ce lien n'est pas valide",
    body: "Le lien semble incomplet ou modifié. Vérifie que tu l'as copié en entier, ou inscris-toi à nouveau depuis le site.",
  },
  error: {
    title: "Une erreur est survenue",
    body: "Nous n'avons pas pu finaliser ton inscription. Merci de réessayer dans quelques instants.",
  },
};

export default async function NewsletterConfirmation({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const key: Status = status && status in MESSAGES ? (status as Status) : "error";
  const { title, body } = MESSAGES[key];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cream pt-16 sm:pt-18">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="font-avenir text-3xl font-black uppercase tracking-wide text-raisin sm:text-4xl">
            {title}
            <span className="mx-auto mt-3 block h-2 w-24 bg-sunglow sm:h-3" />
          </h1>
          <p className="mt-8 font-montserrat text-base leading-relaxed text-raisin/80 sm:text-lg">
            {body}
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center justify-center rounded-full border-2 border-raisin px-8 py-3 font-montserrat text-lg font-medium text-raisin transition-colors duration-200 hover:bg-raisin hover:text-sunglow"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

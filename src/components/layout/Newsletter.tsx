"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

interface NewsletterProps {
  theme?: "light" | "dark";
}

export function Newsletter({ theme = "light" }: NewsletterProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // Honeypot : invisible pour les humains, rempli par les bots.
  const [botField, setBotField] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const result = await subscribeToNewsletter({ firstName, lastName, email, botField });

      if (result.ok) {
        setStatus("success");
        setFirstName("");
        setLastName("");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(result.error ?? "Une erreur est survenue.");
      }
    } catch (err) {
      // La server action elle-même a échoué (réseau, déploiement...) :
      // on repasse en "error" pour ne jamais laisser le formulaire figé.
      console.error("Newsletter submit failed:", err);
      setStatus("error");
      setErrorMessage("Une erreur est survenue. Merci de réessayer.");
    }
  };

  const isDark = theme === "dark";

  const inputClassName = `rounded-md border border-white/50 bg-white px-4 py-2 text-sm text-raisin placeholder:text-raisin/50 focus:outline-none focus:ring-1 ${
    isDark ? "focus:border-violet focus:ring-violet" : "focus:border-indigo focus:ring-indigo"
  }`;

  return (
    <section className={`relative py-6 overflow-hidden ${isDark ? "bg-raisin" : "bg-sunglow"}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          {/* Icône + */}
          <span className={`text-6xl font-light ${isDark ? "text-violet" : "text-white"} leading-none -translate-y-1/3 translate-x-2 sm:text-7xl sm:translate-x-2 lg:translate-x-4`}>
            +
          </span>
          <h3 className={`text-base font-black uppercase tracking-wide sm:text-lg lg:text-2xl pt-2 sm:pt-5 ${isDark ? "text-white" : "text-raisin"}`}>
            Inscris-toi à notre newsletter :
          </h3>
        </div>

        {status === "success" ? (
          <p
            role="status"
            className={`w-full text-sm font-medium sm:w-auto sm:text-right ${isDark ? "text-white" : "text-raisin"}`}
          >
            Merci ! Clique sur le lien qu&apos;on vient de t&apos;envoyer par mail pour confirmer.
          </p>
        ) : (
          <div className="w-full sm:w-auto">
            <form onSubmit={handleSubmit} className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
              <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                aria-label="Prénom"
                className={`${inputClassName} w-full sm:w-34`}
              />
              <input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                aria-label="Nom"
                className={`${inputClassName} w-full sm:w-34`}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
                className={`${inputClassName} w-full sm:w-72`}
              />
              {/* Honeypot anti-bot : hors écran, jamais rempli par un humain. */}
              <div aria-hidden="true" className="absolute left-[-5000px]">
                <input
                  type="text"
                  name="b_8662b47764a2dcf9b2f7389cd_c961fea884"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                colorScheme={isDark ? "white" : "raisin"}
                size="sm"
                disabled={status === "sending"}
                className="disabled:opacity-60"
              >
                {status === "sending" ? "Envoi..." : "Envoyer"}
              </Button>
            </form>

            {status === "error" && (
              <p
                role="alert"
                className={`mt-2 text-sm sm:text-right ${isDark ? "text-violet" : "text-raisin"}`}
              >
                {errorMessage}
              </p>
            )}

            {/* Mention RGPD : information sur le traitement au point de collecte. */}
            <p
              className={`mt-2 text-xs leading-relaxed sm:text-right ${isDark ? "text-white/70" : "text-raisin/70"}`}
            >
              Tes données sont utilisées uniquement pour t&apos;envoyer notre newsletter et ne sont
              jamais cédées à des tiers. Désinscription possible à tout moment via le lien en bas de
              chaque email.{" "}
              <Link
                href="/mentions-legales#donnees-personnelles"
                className="underline hover:opacity-70"
              >
                En savoir plus
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

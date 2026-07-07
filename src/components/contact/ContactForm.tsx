"use client";

import { useState } from "react";
import { Button, Input, Textarea, Select, AnimatedUnderlineText } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";
import { SERVICES } from "@/constants";
import { sendContactEmail } from "@/app/contact/actions";

// Libellé lisible (« STRATÉGIE » → « Stratégie ») et valeur en slug.
const toLabel = (title: string) => title.charAt(0) + title.slice(1).toLowerCase();
const toValue = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");

// Options dérivées des services réels pour rester synchronisées.
const interestOptions = [
  { value: "", label: "Sélectionnez une option" },
  ...SERVICES.map((service) => ({ value: toValue(service.title), label: toLabel(service.title) })),
  { value: "autre", label: "Autre" },
];

export function ContactForm() {
  const { ref: titleRef, isVisible: isTitleInView } = useIntersectionTrigger<HTMLDivElement>({
    threshold: 0.3,
    rootMargin: "-50px",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const result = await sendContactEmail(formData);

    if (result.ok) {
      setStatus("success");
      setFormData({ name: "", email: "", interest: "", message: "" });
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Une erreur est survenue.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputStyles = "border-0 shadow-sm focus:ring-sunglow focus:border-sunglow";

  return (
    <section className="relative overflow-hidden bg-cream py-16 sm:py-24">
      {/* Decorative circle with horizontal stripes - top right */}
      <div className="absolute -top-32 -right-32 w-80 h-80 lg:w-120 lg:h-120 hidden lg:block" aria-hidden="true">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
        >
          <defs>
            <pattern
              id="horizontal-stripes"
              patternUnits="userSpaceOnUse"
              width="400"
              height="16"
            >
              <rect width="400" height="8" fill="white" fillOpacity="0.7" />
              <rect y="8" width="400" height="8" fill="transparent" />
            </pattern>
          </defs>
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="url(#horizontal-stripes)"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Title with underline */}
          <div ref={titleRef} className="mb-10">
            <h2 className="inline-block text-3xl font-black text-raisin sm:text-4xl lg:text-5xl">
              <AnimatedUnderlineText isVisible={isTitleInView}>
                CONTACTEZ-NOUS
              </AnimatedUnderlineText>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Votre nom et prénom"
              value={formData.name}
              onChange={handleChange}
              className={inputStyles}
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Votre adresse email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyles}
              required
            />

            <Select
              id="interest"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              options={interestOptions}
              className={inputStyles}
              chevronColor="text-sunglow"
              required
            />

            <Textarea
              id="message"
              name="message"
              placeholder="Votre message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={inputStyles}
              required
            />

            {status === "success" && (
              <p
                role="status"
                className="rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800"
              >
                Merci ! Votre message a bien été envoyé, nous vous répondrons rapidement.
              </p>
            )}

            {status === "error" && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-800"
              >
                {errorMessage}
              </p>
            )}

            <div className="pt-4 text-center">
              <Button
                type="submit"
                colorScheme="sunglow"
                size="lg"
                className="px-16 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Envoi en cours…" : "Envoyer"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

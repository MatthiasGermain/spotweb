"use client";

import { useState } from "react";
import { Button, Input, Textarea, Select, AnimatedUnderlineText } from "@/components/ui";
import { useIntersectionTrigger } from "@/hooks";

const interestOptions = [
  { value: "", label: "Sélectionnez une option" },
  { value: "branding", label: "Branding & Identité visuelle" },
  { value: "web", label: "Création de site web" },
  { value: "social", label: "Réseaux sociaux" },
  { value: "video", label: "Production vidéo" },
  { value: "photo", label: "Photographie" },
  { value: "print", label: "Supports print" },
  { value: "other", label: "Autre" },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du formulaire
    console.log("Form submitted:", formData);
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

            <div className="pt-4 text-center">
              <Button type="submit" colorScheme="sunglow" size="lg" className="px-16">
                Envoyer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

interface NewsletterProps {
  theme?: "light" | "dark";
}

export function Newsletter({ theme = "light" }: NewsletterProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'inscription newsletter
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const isDark = theme === "dark";

  return (
    <section className={`relative py-6 overflow-hidden ${isDark ? "bg-raisin" : "bg-sunglow"}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          {/* Icône + */}
          <span className={`text-6xl font-light ${isDark ? "text-violet" : "text-white"} leading-none -translate-y-1/3 translate-x-2 sm:text-7xl sm:translate-x-2 lg:translate-x-4`}>
            +
          </span>
          <h3 className={`text-base font-bold uppercase tracking-wide sm:text-lg lg:text-3xl pt-2 sm:pt-4 ${isDark ? "text-white" : "text-raisin"}`}>
            Inscris-toi à notre newsletter :
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 sm:w-auto">
          <input
            type="email"
            placeholder="Email :"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`flex-1 rounded-md border border-white/50 bg-white px-4 py-2 text-sm text-raisin placeholder:text-raisin/50 focus:outline-none focus:ring-1 sm:w-64 ${
              isDark ? "focus:border-violet focus:ring-violet" : "focus:border-indigo focus:ring-indigo"
            }`}
          />
          <Button type="submit" variant={isDark ? "secondary" : "dark"} size="sm">
            Envoyer
          </Button>
        </form>
      </div>
    </section>
  );
}

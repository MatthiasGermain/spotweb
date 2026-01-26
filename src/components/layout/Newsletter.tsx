"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'inscription newsletter
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="bg-sunglow py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo">+</span>
          <h3 className="text-sm font-bold uppercase tracking-wide text-raisin sm:text-base">
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
            className="flex-1 rounded-md border border-white/50 bg-white px-4 py-2 text-sm text-raisin placeholder:text-raisin/50 focus:border-indigo focus:outline-none focus:ring-1 focus:ring-indigo sm:w-64"
          />
          <Button type="submit" variant="secondary" size="sm">
            Envoyer
          </Button>
        </form>
      </div>
    </section>
  );
}

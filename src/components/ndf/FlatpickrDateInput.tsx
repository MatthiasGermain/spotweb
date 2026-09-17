"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import { French } from "flatpickr/dist/l10n/fr.js";
import type { Instance } from "flatpickr/dist/types/instance";

export default function FlatpickrDateInput({
  name,
  defaultValue = "",
  className,
  placeholder = "jj/mm/aaaa",
}: {
  name: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    fpRef.current = flatpickr(inputRef.current, {
      locale: French,
      dateFormat: "d/m/Y",
      allowInput: true,
    });
    return () => {
      fpRef.current?.destroy();
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      defaultValue={defaultValue}
      className={className}
      placeholder={placeholder}
      autoComplete="off"
    />
  );
}

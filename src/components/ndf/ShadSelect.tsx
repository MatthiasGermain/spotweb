"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

export interface ShadSelectOption {
  value: string;
  label: string;
}

export default function ShadSelect({
  name,
  options,
  defaultValue = "",
  placeholder = "Sélectionner…",
  id,
  onValueChange,
}: {
  name: string;
  options: ShadSelectOption[];
  defaultValue?: string;
  placeholder?: string;
  id?: string;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  function select(v: string) {
    setValue(v);
    setOpen(false);
    onValueChange?.(v);
  }

  return (
    <div className="shad-select" ref={ref}>
      <button
        type="button"
        className="shad-select-trigger"
        id={id}
        data-open={open ? "true" : "false"}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
      >
        <span className={`shad-select-value${selected ? "" : " shad-select-placeholder"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronsUpDown className="size-4 shrink-0" style={{ opacity: 0.5 }} />
      </button>
      <div className="shad-select-content" hidden={!open} role="listbox">
        {options.map((opt) => {
          const isSel = opt.value === value;
          return (
            <div
              key={opt.value}
              className="shad-select-item"
              data-selected={isSel ? "true" : "false"}
              onClick={() => select(opt.value)}
              role="option"
              aria-selected={isSel}
            >
              <span className="shad-select-indicator" style={{ opacity: isSel ? 1 : 0 }}>
                <Check className="size-4" />
              </span>
              <span className="shad-select-item-text">{opt.label}</span>
            </div>
          );
        })}
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

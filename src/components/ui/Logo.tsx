import { cn } from "@/lib/utils";
import LogoFull from "../../../public/images/logo_noir_sans_fond.svg";
import LogoIcon from "../../../public/images/pictogramme_noir_sans_fond.svg";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

export function Logo({ variant = "full", className }: LogoProps) {
  if (variant === "icon") {
    return (
      <LogoIcon
        className={cn("h-8 w-8", className)}
        aria-label="Spotlight"
      />
    );
  }

  return (
    <LogoFull
      className={cn("h-10 w-auto", className)}
      aria-label="Spotlight"
    />
  );
}

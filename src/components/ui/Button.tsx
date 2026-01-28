"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline";
  colorScheme?: "sunglow" | "violet" | "raisin" | "white";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", colorScheme = "sunglow", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-montserrat font-medium border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          // Color schemes: transparent bg with colored border/text → hover inverts to colored bg with contrast text
          {
            // Sunglow accent (for cream backgrounds)
            "border-sunglow text-sunglow hover:bg-sunglow hover:text-cream hover:border-sunglow focus:ring-sunglow":
              colorScheme === "sunglow",
            // Violet accent (for light backgrounds)
            "border-violet text-violet hover:bg-violet hover:text-white hover:border-violet focus:ring-violet":
              colorScheme === "violet",
            // Raisin accent (for sunglow backgrounds)
            "border-raisin text-raisin hover:bg-raisin hover:text-sunglow hover:border-raisin focus:ring-raisin":
              colorScheme === "raisin",
            // White accent (for dark backgrounds)
            "border-white text-white hover:bg-white hover:text-raisin hover:border-white focus:ring-white":
              colorScheme === "white",
          },
          // Sizes
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-2.5 text-base": size === "md",
            "px-8 py-3 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

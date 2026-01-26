"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-montserrat font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          {
            "bg-sunglow text-raisin hover:bg-sunglow/70 focus:ring-sunglow":
              variant === "primary",
            "bg-violet text-white hover:bg-violet/95 focus:ring-violet":
              variant === "secondary",
            "border-2 border-violet text-violet hover:bg-violet hover:text-white focus:ring-violet":
              variant === "outline",
          },
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

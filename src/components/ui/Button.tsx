"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  withShadow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", withShadow = false, children, ...props }, ref) => {
    const buttonContent = (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-montserrat font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          {
            "bg-sunglow text-raisin focus:ring-sunglow":
              variant === "primary",
            "bg-violet text-white focus:ring-violet":
              variant === "secondary",
            "border-2 border-violet text-violet hover:bg-violet hover:text-white focus:ring-violet":
              variant === "outline",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-2.5 text-base": size === "md",
            "px-8 py-3 text-lg": size === "lg",
          },
          withShadow ? "relative z-10" : "",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );

    if (withShadow) {
      return (
        <span className="group relative inline-block">
          {/* Shadow layer */}
          <span
            className={cn(
              "absolute inset-0 translate-x-1 translate-y-1 rounded-full transition-transform duration-200 group-hover:translate-x-1.5 group-hover:translate-y-1.5",
              {
                "bg-violet": variant === "primary",
                "bg-sunglow": variant === "secondary" || variant === "outline",
              }
            )}
          />
          {/* Main button */}
          <span className="relative block transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
            {buttonContent}
          </span>
        </span>
      );
    }

    return buttonContent;
  }
);

Button.displayName = "Button";

export { Button };

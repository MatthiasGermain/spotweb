interface AnimatedUnderlineTextProps {
  children: React.ReactNode;
  color?: string;
  isVisible: boolean;
  delay?: string;
  thickness?: string;
  className?: string;
}

export function AnimatedUnderlineText({
  children,
  color = "var(--color-sunglow)",
  isVisible,
  delay = "0ms",
  thickness = "0.35em",
  className = ""
}: AnimatedUnderlineTextProps) {
  return (
    <span
      style={{
        background: `linear-gradient(${color}, ${color}) no-repeat 0 90%`,
        backgroundSize: isVisible ? `100% ${thickness}` : `0% ${thickness}`,
        transition: "background-size 1s ease-out",
        transitionDelay: delay,
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
      className={className}
    >
      {children}
    </span>
  );
}

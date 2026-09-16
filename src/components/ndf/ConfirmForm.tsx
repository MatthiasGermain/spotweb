"use client";

import type { ReactNode, CSSProperties } from "react";

export default function ConfirmForm({
  action,
  confirmMessage,
  className,
  style,
  children,
}: {
  action: (formData: FormData) => void;
  confirmMessage: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <form
      action={action}
      className={className}
      style={style}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}

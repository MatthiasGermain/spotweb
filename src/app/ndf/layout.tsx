import type { Metadata } from "next";
import "./ndf.css";

export const metadata: Metadata = {
  title: {
    default: "Notes de frais",
    template: "%s | Notes de frais",
  },
  description: "Eglise Connexion & Family Connect",
  robots: { index: false, follow: false },
};

export default function NdfRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="ndf-app">{children}</div>;
}

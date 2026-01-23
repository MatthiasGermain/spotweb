import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = localFont({
  src: [
    { path: "../../public/fonts/Montserrat-Light.otf", weight: "300" },
    { path: "../../public/fonts/Montserrat-Regular.otf", weight: "400" },
    { path: "../../public/fonts/Montserrat-Medium.otf", weight: "500" },
    { path: "../../public/fonts/Montserrat-SemiBold.otf", weight: "600" },
    { path: "../../public/fonts/Montserrat-Bold.otf", weight: "700" },
    { path: "../../public/fonts/Montserrat-ExtraBold.otf", weight: "800" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

const avenir = localFont({
  src: [
    { path: "../../public/fonts/AvenirLTStd-Light.otf", weight: "300" },
    { path: "../../public/fonts/AvenirLTStd-Book.otf", weight: "400" },
    { path: "../../public/fonts/AvenirLTStd-Roman.otf", weight: "450" },
    { path: "../../public/fonts/AvenirLTStd-Medium.otf", weight: "500" },
    { path: "../../public/fonts/AvenirLTStd-Heavy.otf", weight: "700" },
    { path: "../../public/fonts/AvenirLTStd-Black.otf", weight: "900" },
  ],
  variable: "--font-avenir",
  display: "swap",
});

const brittany = localFont({
  src: "../../public/fonts/BrittanySignature.ttf",
  variable: "--font-brittany",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spotlight | Agence de Communication Chrétienne",
  description: "Spotlight est une agence de communication chrétienne qui accompagne les structures et projets à mettre en lumière leurs actions pour atteindre leurs objectifs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} ${avenir.variable} ${brittany.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

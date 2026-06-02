import type { Metadata } from "next";
import localFont from "next/font/local";
import { ViewTransitions } from "next-view-transitions";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_OG_IMAGE } from "@/constants";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Spotlight | Agence de Communication Chrétienne",
    template: "%s | Spotlight",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "agence de communication",
    "communication chrétienne",
    "Église",
    "stratégie de communication",
    "graphisme",
    "site web",
    "vidéo",
    "motion design",
    "réseaux sociaux",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Spotlight | Agence de Communication Chrétienne",
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotlight | Agence de Communication Chrétienne",
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body className={`${montserrat.variable} ${avenir.variable} ${brittany.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}

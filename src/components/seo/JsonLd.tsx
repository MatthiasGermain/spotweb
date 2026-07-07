import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
  ORGANIZATION,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
  SERVICES,
} from "@/constants";

// Données structurées schema.org injectées sur toutes les pages.
// Alimente le knowledge panel Google et les résultats enrichis.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: ORGANIZATION.legalName,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: ORGANIZATION.logo,
  image: `${SITE_URL}${SITE_OG_IMAGE.url}`,
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ORGANIZATION.address.streetAddress,
    postalCode: ORGANIZATION.address.postalCode,
    addressLocality: ORGANIZATION.address.addressLocality,
    addressCountry: ORGANIZATION.address.addressCountry,
  },
  areaServed: { "@type": "Country", name: "France" },
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.linkedin],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de communication",
    itemListElement: SERVICES.map((service) => ({
      "@type": "OfferCatalog",
      name: service.title,
      itemListElement: service.subServices.map((sub) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: sub },
      })),
    })),
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

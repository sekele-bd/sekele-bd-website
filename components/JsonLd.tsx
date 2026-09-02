type ContactData = {
  address?: string;
  phone?: string;
  email?: string;
};

type SocialItem = {
  platform: string;
  url: string;
};

type Props = {
  contact?: ContactData;
  socials?: SocialItem[];
};

export default function JsonLd({ contact = {}, socials = [] }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sekelebd.com";

  const sameAs = socials
    .filter((s) => s.url && s.url !== "#")
    .map((s) => s.url);

  const data = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService","PhotographBusiness"],
    "@id": `${siteUrl}/#business`,
    name: "Sekele Photography",
    alternateName: "Sekele",
    description:
      "Professional event photography and cinematography in Bangladesh. We cover Wedding, Reception, Gaye Holud, Birthday, Corporate and all indoor & outdoor events — inside and outside Dhaka.",
    url: siteUrl,
    logo: `${siteUrl}/footerlogo.png`,
    image: `${siteUrl}/og-image.jpg`,
    telephone: contact.phone || undefined,
    email: contact.email || undefined,
    address: contact.address
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.address,
          addressLocality: "Dhaka",
          addressCountry: "BD",
        }
      : {
          "@type": "PostalAddress",
          addressLocality: "Dhaka",
          addressCountry: "BD",
        },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.8103,
      longitude: 90.4125,
    },
    priceRange: "$$",
    currenciesAccepted: "BDT",
    paymentAccepted: "Cash, Bank Transfer, bKash, Nagad",
    areaServed: [
      {
        "@type": "City",
        name: "Dhaka",
      },
      {
        "@type": "Country",
        name: "Bangladesh",
      },
    ],
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  const cleaned = JSON.parse(JSON.stringify(data));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleaned) }}
    />
  );
}
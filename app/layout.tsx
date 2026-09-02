import type { Metadata } from "next";
import "./globals.css";

export const revalidate = 3600;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sekelebd.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Sekele | Event Photography & Cinematography Bangladesh",
    template: "%s | Sekele Photography",
  },

  description:
    "Professional event photography & cinematography in Bangladesh. Wedding, Engagement, Reception, Gaye Holud, Birthday, Indoor & Outdoor events — inside & outside Dhaka.",
  keywords: [

    "event photography Bangladesh",
    "wedding photography Dhaka",
    "cinematography Bangladesh",
    "gaye holud photography",
    "reception photography",
    "birthday photography Dhaka",
    "outdoor event photography",
    "indoor event photographer",
    "Sekele photography",
    "wedding videography Bangladesh",
    "event cinematography Dhaka",
    "photography outside Dhaka",

    // =========================
    // GENERAL PHOTOGRAPHY
    // =========================
    "photography Bangladesh",
    "photographer Bangladesh",
    "professional photographer Bangladesh",
    "photography studio Bangladesh",
    "photography service Bangladesh",
    "professional photography service",
    "best photographer Bangladesh",
    "photographer Dhaka",
    "photography Dhaka",
    "professional photographer Dhaka",
    "photography studio Dhaka",

    // =========================
    // WEDDING
    // =========================
    "wedding photography Bangladesh",
    "wedding photographer Bangladesh",
    "wedding photography Dhaka",
    "wedding photographer Dhaka",
    "candid wedding photography",
    "candid wedding photographer",
    "Bangladeshi wedding photography",
    "Bengali wedding photography",
    "Muslim wedding photography",
    "traditional wedding photography",
    "wedding videography Bangladesh",
    "wedding videographer Dhaka",
    "cinematic wedding video",

    // =========================
    // PRE-WEDDING / COUPLE
    // =========================
    "pre wedding photography Bangladesh",
    "pre wedding photographer Bangladesh",
    "pre wedding photography Dhaka",
    "pre wedding photoshoot",
    "engagement photography",
    "engagement photographer Bangladesh",
    "couple photography Bangladesh",
    "couple photographer Dhaka",
    "couple photoshoot",
    "romantic couple photography",
    "outdoor couple photography",

    // =========================
    // PORTRAIT
    // =========================
    "portrait photography Bangladesh",
    "portrait photographer Bangladesh",
    "portrait photography Dhaka",
    "professional portrait photographer",
    "personal portrait photography",
    "creative portrait photography",
    "studio portrait photography",
    "outdoor portrait photography",
    "headshot photographer Bangladesh",
    "professional headshot Dhaka",

    // =========================
    // FAMILY / LIFESTYLE
    // =========================
    "family photography Bangladesh",
    "family photographer Dhaka",
    "family photoshoot",
    "lifestyle photography Bangladesh",
    "lifestyle photographer Dhaka",
    "baby photography Bangladesh",
    "baby photographer Dhaka",
    "kids photography Bangladesh",
    "maternity photography Bangladesh",
    "maternity photographer Dhaka",
    "birthday photography Bangladesh",
    "birthday photographer Dhaka",

    // =========================
    // EVENTS
    // =========================
    "event photography Bangladesh",
    "event photographer Bangladesh",
    "event photography Dhaka",
    "event photographer Dhaka",
    "corporate event photography",
    "corporate event photographer",
    "conference photography Bangladesh",
    "seminar photography Dhaka",
    "concert photography Bangladesh",
    "concert photographer Dhaka",
    "festival photography Bangladesh",
    "cultural event photography",
    "school event photography",
    "university event photography",
    "party photography Bangladesh",
    "private event photographer",

    // =========================
    // OUTDOOR
    // =========================
    "outdoor photography Bangladesh",
    "outdoor photographer Bangladesh",
    "outdoor photography Dhaka",
    "outdoor photoshoot Bangladesh",
    "outdoor photoshoot Dhaka",
    "nature photography Bangladesh",
    "travel photography Bangladesh",
    "travel photographer Bangladesh",
    "destination photography",
    "adventure photography Bangladesh",
    "beach photography Bangladesh",
    "street photography Bangladesh",

    // =========================
    // FASHION / MODEL
    // =========================
    "fashion photography Bangladesh",
    "fashion photographer Bangladesh",
    "fashion photography Dhaka",
    "fashion photographer Dhaka",
    "model photography Bangladesh",
    "model photographer Dhaka",
    "editorial photography Bangladesh",
    "editorial photographer Dhaka",
    "lookbook photography",
    "portfolio photographer Bangladesh",
    "model portfolio photography",

    // =========================
    // COMMERCIAL / BRAND
    // =========================
    "commercial photography Bangladesh",
    "commercial photographer Bangladesh",
    "commercial photography Dhaka",
    "product photography Bangladesh",
    "product photographer Dhaka",
    "brand photography Bangladesh",
    "brand photographer Dhaka",
    "business photography",
    "corporate photography Bangladesh",
    "corporate photographer Dhaka",
    "advertising photography Bangladesh",
    "food photography Bangladesh",
    "restaurant photography Dhaka",
    "real estate photography Bangladesh",
    "architecture photography Bangladesh",

    // =========================
    // SPORTS
    // =========================
    "sports photography Bangladesh",
    "sports photographer Dhaka",
    "football photography Bangladesh",
    "cricket photography Bangladesh",
    "sports event photographer",

    // =========================
    // TRAVEL / DOCUMENTARY
    // =========================
    "documentary photography Bangladesh",
    "documentary photographer Bangladesh",
    "travel photography Dhaka",
    "travel photographer Dhaka",
    "Bangladesh travel photographer",
    "cultural photography Bangladesh",
    "photojournalism Bangladesh",

    // =========================
    // VIDEO / CINEMATOGRAPHY
    // =========================
    "videography Bangladesh",
    "videographer Bangladesh",
    "videography Dhaka",
    "videographer Dhaka",
    "professional videographer Bangladesh",
    "cinematography Bangladesh",
    "cinematic videography",
    "event videography Bangladesh",
    "corporate videography Bangladesh",
    "commercial videography Bangladesh",

    // =========================
    // BRAND
    // =========================
    "Sekele Photography",
    "Sekele cinematography",
    "Sekele photographer",
    "Sekele Bangladesh",
    "Sekele photography Bangladesh",

    // =========================
    // BANGLA SEARCH TERMS
    // =========================
    "ফটোগ্রাফার বাংলাদেশ",
    "ফটোগ্রাফার ঢাকা",
    "ফটোগ্রাফি বাংলাদেশ",
    "ফটোগ্রাফি ঢাকা",
    "বিয়ের ফটোগ্রাফি",
    "বিয়ের ফটোগ্রাফার",
    "ইভেন্ট ফটোগ্রাফি",
    "ইভেন্ট ফটোগ্রাফার",
    "আউটডোর ফটোগ্রাফি",
    "কাপল ফটোগ্রাফি",
    "পোর্ট্রেট ফটোগ্রাফি",
    "ফ্যাশন ফটোগ্রাফি",
    "কর্পোরেট ফটোগ্রাফি",
    "প্রোডাক্ট ফটোগ্রাফি",
    "ফ্যামিলি ফটোগ্রাফি",
    "বাচ্চাদের ফটোগ্রাফি",
    "ভিডিওগ্রাফি",
  ],

  authors: [
    {
      name: "Sekele Photography",
      url: siteUrl,
    },
  ],

  creator: "Sekele Photography",
  publisher: "Sekele Photography",

  category: "Photography",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "en_BD",
    url: siteUrl,
    siteName: "Sekele Photography",

   title: "Sekele | Event Photography & Cinematography Bangladesh",
    description:
      "Wedding, Engagement, Reception, Gaye Holud, Birthday & all events. Photography + Cinematography inside & outside Dhaka.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sekele Event Photography & Cinematography",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Sekele Photography | Professional Photographer in Bangladesh",

    description:
      "Professional photography and videography for weddings, events, portraits, outdoor shoots, fashion, corporate and commercial projects.",

    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-BD">
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}

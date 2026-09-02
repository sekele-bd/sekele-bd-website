import type { Metadata } from "next";
import BookingPageClient from "@/components/booking/BookingPageClient";
import { getContact } from "@/lib/data";


export const metadata: Metadata = {
  title: "Book / Contact",
  description:
    "Book Sekele for Wedding, Reception, Gaye Holud, Birthday or any event photography & cinematography. Call, WhatsApp or email us.",
  openGraph: {
    title: "Book / Contact | Sekele Photography",
    description:
      "Get in touch to book your event photography & cinematography with Sekele.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/booking",
  },
};

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop";

export default async function BookingPage() {
  const data = await getContact().catch(() => ({
    title: "We would love to hear from you",
    address: "",
    phone: "",
    email: "",
    note: "",
    heroImage: DEFAULT_HERO,
    socials: [],
  }));

  return (
    <BookingPageClient
      data={{
        ...data,
        heroImage: data.heroImage || DEFAULT_HERO,
      }}
    />
  );
}
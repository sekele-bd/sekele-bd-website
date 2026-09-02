import type { Metadata } from "next";
import BookingPageClient from "@/components/booking/BookingPageClient";
import { getContact } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book / Contact | Sekele Photography",
  description:
    "Call, WhatsApp or email Sekele to book your wedding photography consultation.",
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
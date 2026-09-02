import FAQHero from "@/components/faq/FAQHero";
import FAQList from "@/components/faq/FAQList";
import BookingCTA from "@/components/BookingCTA";
import { getFaqs, getContact } from "@/lib/data";

export const metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Sekele event photography & cinematography. Booking, packages, coverage area and more.",
  openGraph: {
    title: "FAQ | Sekele Photography",
    description:
      "Common questions about our event photography and cinematography services.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/faq",
  },
};

export default async function FAQPage() {
  const [faqs, contact] = await Promise.all([
    getFaqs().catch(() => []),
    getContact().catch(() => ({ phone: "" } as Awaited<ReturnType<typeof getContact>>)),
  ]);

  return (
    <>
      <FAQHero />
      <FAQList faqs={faqs} />
      <BookingCTA phone={contact.phone || ""} />
    </>
  );
}
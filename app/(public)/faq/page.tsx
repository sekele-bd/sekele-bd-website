import FAQHero from "@/components/faq/FAQHero";
import FAQList from "@/components/faq/FAQList";
import BookingCTA from "@/components/BookingCTA";
import { getFaqs, getContact } from "@/lib/data";

export const metadata = {
  title: "FAQ | Sekele Photography",
  description: "Frequently asked questions about Sekele wedding photography.",
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
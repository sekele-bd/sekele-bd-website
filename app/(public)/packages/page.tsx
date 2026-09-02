import PackagesHero from "@/components/packages/PackagesHero";
import PackagesGrid from "@/components/packages/PackagesGrid";
import PackagesNote from "@/components/packages/PackagesNote";
import BookingCTA from "@/components/BookingCTA";
import { getPackages, getPackagesNote, getContact } from "@/lib/data";

export const metadata = {
  title: "Packages | Sekele Photography",
  description: "Find the right photography package for your wedding.",
};

export default async function PackagesPage() {
  const [packages, note, contact] = await Promise.all([
    getPackages().catch(() => []),
    getPackagesNote().catch(() => ({
      title: "Good to know",
      items: [] as string[],
    })),
    getContact().catch(() => ({ phone: ""} as Awaited<ReturnType<typeof getContact>>)),
  ]);

  const mapped = packages.map((pkg) => ({
    ...pkg,
    type: pkg.type || "",
    image: pkg.image || "/packages/IMG_4040.JPG-2.jpeg",
  }));

  return (
    <>
      <PackagesHero />
      <PackagesGrid packages={mapped} />
      <PackagesNote title={note.title} items={note.items} />
      <BookingCTA phone={contact.phone || ""} />
    </>
  );
}
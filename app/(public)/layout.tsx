import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContact } from "@/lib/data";

/** ISR hint — data still uses unstable_cache tags */
export const revalidate = 3600;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await getContact().catch(() => ({
    title: "Get in touch",
    address: "",
    phone: "",
    email: "",
    note: "",
    heroImage: "",
    socials: [] as { id: string; platform: string; url: string }[],
  }));

  return (
    <>
      <Navbar />
      {children}
      <Footer
        contact={{
          address: contact.address,
          phone: contact.phone,
          email: contact.email,
        }}
        socials={contact.socials.map((s) => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
        }))}
      />
    </>
  );
}
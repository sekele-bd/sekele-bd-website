import AboutHero from "@/components/about/AboutHero";
import AboutTeam from "@/components/about/AboutTeam";
import AboutValues from "@/components/about/AboutValues";
import AboutOffice from "@/components/about/AboutOffice";
import BookingCTA from "@/components/BookingCTA";
import { getOurStory, getTeam, getContact } from "@/lib/data";

export const metadata = {
  title: "About Us",
  description:
    "Meet the team behind Sekele — professional event photography & cinematography in Bangladesh. Wedding, Reception, Gaye Holud, Birthday and all events.",
  openGraph: {
    title: "About Us | Sekele Photography",
    description:
      "Meet the team behind Sekele — event photography & cinematography across Bangladesh.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const [story, members, contact] = await Promise.all([
    getOurStory().catch(() => ({
      title: "Our Story",
      paragraphs: [] as string[],
    })),
    getTeam().catch(() => []),
    getContact().catch(() => ({
      address: "",
      phone: "",
      email: "",
      socials: [] as { id: string; platform: string; url: string }[],
    })),
  ]);

  return (
    <>
      <AboutHero title={story.title} paragraphs={story.paragraphs} />
      <AboutTeam members={members} />
      <AboutValues />
      <AboutOffice
        contact={{
          address: contact.address,
          phone: contact.phone,
          email: contact.email,
        }}
        socials={(contact.socials || []).map((s) => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
        }))}
      />
      <BookingCTA phone={contact.phone || ""} />
    </>
  );
}
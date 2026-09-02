import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import Stats from "@/components/Stats";
import FeaturedAlbums from "@/components/FeaturedAlbums";
import PackagesPreview from "@/components/PackagesPreview";
import Reviews from "@/components/Reviews";
import BookingCTA from "@/components/BookingCTA";
import {
  getSliders,
  getOurStory,
  getStats,
  getAlbums,
  getContact,
} from "@/lib/data";

export default async function Home() {
  const [sliders, story, stats, albums, contact] = await Promise.all([
    getSliders().catch(() => []),
    getOurStory().catch(() => ({ title: "Welcome to Sekele", paragraphs: [] as string[] })),
    getStats().catch(() => ({
      sectionTitle: "Moments we've been trusted with",
      items: [] as { value: number; suffix?: string; label: string; description?: string }[],
    })),
    getAlbums(true).catch(() => []),
    getContact().catch(() => ({
      phone: "",
    })),
  ]);

  const slides =
    sliders.length > 0
      ? sliders.map((s) => ({ image: s.image, alt: s.alt || "" }))
      : undefined;

  const featuredAlbums = albums.map((a) => ({
    id: a.id,
    title: a.title,
    location: a.location || "",
    image: a.cover || a.images?.[0]?.url || "",
    href: `/albums/${a.slug || a.id}`,
  }));

  return (
    <>
      <Hero slides={slides} />
      <OurStory title={story.title} paragraphs={story.paragraphs} />
      <Stats sectionTitle={stats.sectionTitle} items={stats.items} />
      <FeaturedAlbums albums={featuredAlbums} />
      <PackagesPreview />
      <Reviews />
      <BookingCTA
        phone={contact.phone || ""}
       
      />
    </>
  );
}
import AlbumsGrid from "@/components/albums/AlbumsGrid";
import AlbumsHero from "@/components/albums/AlbumsHero";
import BookingCTA from "@/components/BookingCTA";
import FeaturedFilms from "@/components/FeaturedFilms";
import { getAlbums, getFilms, getContact } from "@/lib/data";

export const metadata = {
  title: "Albums",
  description:
    "Explore our event photography albums — Wedding, Reception, Gaye Holud, Birthday and more. Indoor & outdoor coverage across Bangladesh.",
  openGraph: {
    title: "Albums | Sekele Photography",
    description:
      "Browse our collection of event photography albums from across Bangladesh.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/albums",
  },
};

export default async function AlbumsPage() {
  const [albums, films, contact] = await Promise.all([
    getAlbums()
      .then((items) =>
        items.map((album) => ({
          id: album.slug || album.id,
          title: album.title,
          location: album.location || "",
          image: album.cover || album.images[0]?.url || "",
        }))
      )
      .catch(() => undefined),
    getFilms()
      .then((items) =>
        items.map((f) => ({
          id: f.id,
          title: f.title,
          youtubeUrl: f.youtubeUrl,
        }))
      )
      .catch(() => []),
    getContact().catch(() => ({ phone: "" })),
  ]);

  return (
    <>
      <AlbumsHero />
      <AlbumsGrid albums={albums} />
      <FeaturedFilms films={films} />
      <BookingCTA phone={contact.phone || ""} />
    </>
  );
}
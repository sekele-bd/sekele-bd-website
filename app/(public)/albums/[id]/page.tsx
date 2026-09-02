import { notFound } from "next/navigation";
import AlbumDetail from "@/components/albums/AlbumDetail";
import BookingCTA from "@/components/BookingCTA";
import { getAlbumBySlug, getContact } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const album = await getAlbumBySlug(id).catch(() => null);
  if (!album) return { title: "Album | Sekele" };
  return {
    title: `${album.title} | Sekele Photography`,
    description: album.location || "Wedding album by Sekele",
  };
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params;
  const [album, contact] = await Promise.all([
    getAlbumBySlug(id).catch(() => null),
    getContact().catch(() => ({ phone: "" } as Awaited<ReturnType<typeof getContact>>)),
  ]);

  if (!album) notFound();

  const images = [
  ...(album.cover ? [album.cover] : []),
  ...album.images.map((i) => i.url).filter((u) => u !== album.cover),
];

  return (
    <>
      <AlbumDetail
  album={{
    id: album.id,
    title: album.title,
    location: album.location || "",
    date: album.date || "",
    type: album.type || "",
    description: album.description || "",
    cover: album.cover || images[0] || "",
    images,
  }}
/>
      <BookingCTA phone={contact.phone} />
    </>
  );
}
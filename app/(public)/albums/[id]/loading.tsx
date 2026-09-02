// app/(public)/albums/[id]/loading.tsx
import Loading from "@/components/Loading";

export default function AlbumDetailLoading() {
  return <Loading variant="page" label="Opening album…" />;
}
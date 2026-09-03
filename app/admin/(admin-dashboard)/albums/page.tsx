import AdminAlbumsClient from "./AdminAlbumsClient";
import { getAdminAlbums } from "@/lib/admin-data";

export default async function AdminAlbumsPage() {
  const albums = await getAdminAlbums();
  return <AdminAlbumsClient initialItems={albums} />;
}

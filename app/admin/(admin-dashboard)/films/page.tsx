import AdminFilmsClient from "./AdminFilmsClient";
import { getAdminFilms } from "@/lib/admin-data";

export default async function AdminFilmsPage() {
  const films = await getAdminFilms();
  return <AdminFilmsClient initialItems={films} />;
}

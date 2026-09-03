import AdminPackagesClient from "./AdminPackagesClient";
import { getAdminPackages, getAdminPackagesNote } from "@/lib/admin-data";

export default async function AdminPackagesPage() {
  const [packages, note] = await Promise.all([
    getAdminPackages(),
    getAdminPackagesNote(),
  ]);
  return <AdminPackagesClient initialItems={packages} initialNote={note} />;
}

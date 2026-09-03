import AdminSocialsClient from "./AdminSocialsClient";
import { getAdminSocials } from "@/lib/admin-data";

export default async function AdminSocialsPage() {
  const socials = await getAdminSocials();
  return <AdminSocialsClient initialItems={socials} />;
}

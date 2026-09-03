import AdminSlidersClient from "./AdminSlidersClient";
import { getAdminSliders } from "@/lib/admin-data";

export default async function AdminSlidersPage() {
  const sliders = await getAdminSliders();
  return <AdminSlidersClient initialItems={sliders} />;
}

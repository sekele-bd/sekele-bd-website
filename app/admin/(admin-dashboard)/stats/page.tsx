import AdminStatsClient from "./AdminStatsClient";
import { getAdminStats } from "@/lib/admin-data";

export default async function AdminStatsPage() {
  const stats = await getAdminStats();
  return <AdminStatsClient initialData={stats} />;
}

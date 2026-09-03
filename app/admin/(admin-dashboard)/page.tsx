import AdminDashboardClient from "./AdminDashboardClient";
import { getAdminDashboardData } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  return <AdminDashboardClient initialData={data} />;
}

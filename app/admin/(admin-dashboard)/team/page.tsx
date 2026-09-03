import AdminTeamClient from "./AdminTeamClient";
import { getAdminTeam } from "@/lib/admin-data";

export default async function AdminTeamPage() {
  const team = await getAdminTeam();
  return <AdminTeamClient initialItems={team} />;
}

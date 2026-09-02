import { redirect } from "next/navigation";
import { getCurrentAdmin } from "./auth";

// Separate protected wrapper used by pages
export async function requireAdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

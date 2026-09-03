import AdminContactClient from "./AdminContactClient";
import { getAdminContact } from "@/lib/admin-data";

export default async function AdminContactPage() {
  const contact = await getAdminContact();
  return <AdminContactClient initialData={contact} />;
}

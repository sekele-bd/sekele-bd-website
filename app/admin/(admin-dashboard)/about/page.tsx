import AdminAboutClient from "./AdminAboutClient";
import { getAdminAbout } from "@/lib/admin-data";

export default async function AdminAboutPage() {
  const story = await getAdminAbout();
  return <AdminAboutClient initialData={story} />;
}

import AdminFaqsClient from "./AdminFaqsClient";
import { getAdminFaqs } from "@/lib/admin-data";

export default async function AdminFaqsPage() {
  const faqs = await getAdminFaqs();
  return <AdminFaqsClient initialItems={faqs} />;
}

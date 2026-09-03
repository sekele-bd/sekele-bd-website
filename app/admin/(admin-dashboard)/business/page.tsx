import BusinessClient from "./BusinessClient";
import { getAdminContact, getAdminSocials } from "@/lib/admin-data";

export default async function AdminBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const [initialContact, initialSocials] = await Promise.all([
    getAdminContact(),
    getAdminSocials(),
  ]);

  return (
    <BusinessClient
      requestedTab={tab}
      initialContact={initialContact}
      initialSocials={initialSocials}
    />
  );
}

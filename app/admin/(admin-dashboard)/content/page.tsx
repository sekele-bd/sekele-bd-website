import ContentClient from "./ContentClient";
import {
  getAdminAbout,
  getAdminFaqs,
  getAdminSliders,
  getAdminStats,
  getAdminTeam,
} from "@/lib/admin-data";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const [initialAbout, initialFaqs, initialSliders, initialStats, initialTeam] =
    await Promise.all([
      getAdminAbout(),
      getAdminFaqs(),
      getAdminSliders(),
      getAdminStats(),
      getAdminTeam(),
    ]);

  return (
    <ContentClient
      requestedTab={tab}
      initialAbout={initialAbout}
      initialFaqs={initialFaqs}
      initialSliders={initialSliders}
      initialStats={initialStats}
      initialTeam={initialTeam}
    />
  );
}

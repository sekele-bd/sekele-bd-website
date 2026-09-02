import AdminShell from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/Toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own layout feel — skip shell
  // We detect via a simple approach: children only
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}


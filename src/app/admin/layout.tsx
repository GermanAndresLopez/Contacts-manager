import { verifyAdminSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyAdminSession();

  return (
    <div className="flex min-h-dvh flex-col sm:flex-row">
      <AdminSidebar />
      <main className="flex-1 bg-muted/30 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}

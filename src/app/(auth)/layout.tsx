import AppSidebar from "@/components/layout/sidebar";
import { NewRequestNotifier } from "@/components/notifications/new-request-notifier";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1">
        {children}
      </main>
      <NewRequestNotifier />
    </div>
  );
}

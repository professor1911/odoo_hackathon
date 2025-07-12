
"use client";

import AppSidebar from "@/components/layout/sidebar";
import { NewRequestNotifier } from "@/components/notifications/new-request-notifier";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <NewRequestNotifier />
      </div>
    </SidebarProvider>
  );
}

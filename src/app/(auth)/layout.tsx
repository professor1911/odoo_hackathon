import AppSidebar from "@/components/layout/sidebar";

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
    </div>
  );
}


"use client";

import { useSidebar, SidebarTrigger } from "../ui/sidebar";

interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function Header({ title, description, children }: HeaderProps) {
  const { isMobile } = useSidebar();

  return (
    <header className="border-b bg-card p-4 md:p-6 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isMobile && <SidebarTrigger />}
          <div>
            <h1 className="text-xl md:text-3xl font-bold font-headline">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground hidden md:block">{description}</p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
       {description && (
          <p className="mt-2 text-sm text-muted-foreground md:hidden">{description}</p>
        )}
    </header>
  );
}

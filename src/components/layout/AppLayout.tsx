import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/navigation/Sidebar';

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className={cn(
        "flex-1 overflow-y-auto bg-background",
        "lg:ml-[240px]", // Account for sidebar width on desktop
        "transition-all duration-300",
        className
      )}>
        {children}
      </main>
    </div>
  );
}
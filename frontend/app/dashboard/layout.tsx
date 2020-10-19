import { AppSidebar } from "@/components/layout/AppSidebar";
import { ShellProvider } from "@/components/providers/ShellProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <div className="min-h-screen flex mesh-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    </ShellProvider>
  );
}

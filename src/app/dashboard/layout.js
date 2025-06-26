import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Menu, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider className="w-full h-screen flex">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="w-full border-b">
          <div className="mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </div>
          <Separator />
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}

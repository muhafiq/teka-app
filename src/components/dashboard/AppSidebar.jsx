import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  FileQuestion,
  PowerIcon,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { role } from "@/helpers/schema";

export default async function AppSidebar() {
  const { user } = await auth();

  let items = [];

  if (user.role === role.admin) {
    items = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Finances",
        url: "/dashboard/finances",
        icon: CircleDollarSign,
      },
      {
        title: "Daftar Kelas",
        url: "/dashboard/class-and-students",
        icon: Inbox,
      },
      {
        title: "Kegiatan",
        url: "/dashboard/events",
        icon: Calendar,
      },
      {
        title: "Panduan Aplikasi",
        url: "/dashboard/tutorial",
        icon: FileQuestion,
      },
    ];
  } else if (user.role === role.parent) {
    items = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Pembayaran",
        url: "/dashboard/events",
        icon: CircleDollarSign,
      },
      {
        title: "Panduan Aplikasi",
        url: "/dashboard/tutorial",
        icon: FileQuestion,
      },
    ];
  } else if (user.role === role.teacher) {
    items = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Panduan Aplikasi",
        url: "/dashboard/tutorial",
        icon: FileQuestion,
      },
    ];
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          {/* <Icons.logo className="w-6 h-6 text-primary" /> */}
          <span className="text-lg font-bold">TekaApp</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <SidebarMenuButton className="cursor-pointer flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <PowerIcon className="w-6" />
                <div className="hidden md:block">Sign Out</div>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

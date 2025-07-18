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
  FileQuestion,
  PowerIcon,
  CircleDollarSign,
  PersonStandingIcon,
  ClipboardPen,
  Users,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { role } from "@/helpers/schema";
import { db } from "@/lib/db";
import { parents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { GraduationCap } from "lucide-react";

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
        url: "/dashboard/classrooms",
        icon: Landmark,
      },
      {
        title: "Daftar Guru",
        url: "/dashboard/teachers",
        icon: Users,
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
    const [parent] = await db
      .select({ id: parents.id })
      .from(parents)
      .where(eq(parents.userId, user.id));
    items = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Pembayaran",
        url: "/dashboard/payments",
        icon: CircleDollarSign,
      },
      {
        title: "Daftarkan Anak",
        url: `/dashboard/register-students?parentId=${parent.id}`,
        icon: PersonStandingIcon,
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
        title: "Presensi Siswa",
        url: "/dashboard/presensi/students",
        icon: ClipboardPen,
      },
      {
        title: "Kegiatan Kelas",
        url: "/dashboard/events",
        icon: Calendar,
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
          <Link href="/" className="flex items-center gap-2 select-none">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">TK Tadika Mesra</span>
          </Link>
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

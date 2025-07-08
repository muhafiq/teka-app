import { Suspense } from "react";
import { auth } from "@/auth";
import { role } from "@/helpers/schema";
import AdminDashboard from "@/components/dashboard/dashboard-admin";
import ParentDashboard from "@/components/dashboard/dashboard-parent";
import TeacherDashboard from "@/components/dashboard/dashboard-teacher";
import { ToastHandler } from "@/components/toast-handler";

export default async function Dashboard() {
  const { user } = await auth();

  return (
    <div>
      {user?.role === role.admin ? (
        <AdminDashboard />
      ) : user?.role === role.parent ? (
        <ParentDashboard />
      ) : user?.role === role.teacher ? (
        <TeacherDashboard />
      ) : null}
      <Suspense fallback={<p>Loading...</p>}>
        <ToastHandler message="Anda berhasil login, selamat datang!" />
      </Suspense>
    </div>
  );
}

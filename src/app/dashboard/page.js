import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <DashboardClient />
      </Suspense>
    </div>
  );
}

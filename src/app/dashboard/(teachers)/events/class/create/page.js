import { auth } from "@/auth";
import CreateEventForm from "@/components/dashboard/create-event-form";
import { Suspense } from "react";

export default async function TeacherCreateEvent() {
  const { user } = await auth();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CreateEventForm userId={user.id} />
      </Suspense>
    </div>
  );
}

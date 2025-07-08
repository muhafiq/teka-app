import { auth } from "@/auth";
import CreateEventForm from "@/components/dashboard/create-event-form";
import { Suspense } from "react";

export default async function CreateEventPage() {

  const {user} = await auth();

  return (
    <div>
      <Suspense>
        <CreateEventForm userId={user.id}/>
      </Suspense>
    </div>
  )
}
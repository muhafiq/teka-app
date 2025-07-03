import { Suspense } from "react";
import { db } from "@/lib/db";
import { teachers, users, classrooms } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";
import CreateClassroomForm from "@/components/dashboard/create-classroom-form";

export default async function CreateClassroomPage() {
  const waliKelasList = await db
    .select({
      id: teachers.id,
      name: users.name,
    })
    .from(teachers)
    .leftJoin(users, eq(teachers.userId, users.id))
    .leftJoin(classrooms, eq(classrooms.waliKelas, teachers.id))
    .where(isNull(classrooms.waliKelas));

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <CreateClassroomForm waliKelasList={waliKelasList} />
      </Suspense>
    </div>
  );
}

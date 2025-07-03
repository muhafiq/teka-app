import { Suspense } from "react";
import { db } from "@/lib/db";
import { teachers, users, classrooms } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";
import EditClassroomForm from "@/components/dashboard/edit-classrooms-form";

export default async function EditClassroomPage({ params }) {
  const { id: classroomId } = await params;
  const waliKelasList = await db
    .select({
      waliKelasId: teachers.id,
      name: users.name,
    })
    .from(teachers)
    .leftJoin(users, eq(teachers.userId, users.id))
    .leftJoin(classrooms, eq(classrooms.waliKelas, teachers.id))
    .where(isNull(classrooms.waliKelas));

  const [classroom] = await db
    .select({
      id: classrooms.id,
      location: classrooms.location,
      type: classrooms.type,
      capacity: classrooms.capacity,
      waliKelasId: classrooms.waliKelas,
      waliKelasName: users.name,
      waliKelasUserId: users.id,
    })
    .from(classrooms)
    .leftJoin(teachers, eq(teachers.id, classrooms.waliKelas))
    .leftJoin(users, eq(teachers.userId, users.id))
    .where(eq(classrooms.id, classroomId));

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <EditClassroomForm
          waliKelasList={waliKelasList}
          classroom={classroom}
        />
      </Suspense>
    </div>
  );
}

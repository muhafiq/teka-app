import { students, classrooms, teachers } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, isNotNull } from "drizzle-orm";
import { Suspense } from "react";
import PresensiStudentsForm from "@/components/dashboard/presensi-students-form";

export default async function PresensiStudents() {
  const allStudents = await db
    .select({
      id: students.id,
      name: students.name,
      gender: students.gender,
    })
    .from(teachers)
    .leftJoin(classrooms, eq(teachers.id, classrooms.waliKelas))
    .leftJoin(students, eq(classrooms.id, students.classroomId))
    .where(isNotNull(students.id));

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PresensiStudentsForm studentsData={allStudents} />
      </Suspense>
    </div>
  );
}

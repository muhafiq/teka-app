import { Suspense } from "react";
import EditTeacherForm from "@/components/dashboard/edit-teacher-form";
import { db } from "@/lib/db";
import { teachers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function EditTeacherPage({ params }) {
  const { id: teacherId } = await params;

  const [teacher] = await db
    .select({
      userId: users.id,
      name: users.name,
      phoneNumber: users.phoneNumber,
      nip: teachers.nip,
      gender: teachers.gender,
      religion: teachers.religion,
      address: teachers.address,
      joinedDate: teachers.joinedDate,
    })
    .from(teachers)
    .leftJoin(users, eq(users.id, teachers.userId))
    .where(eq(teachers.id, teacherId));

  console.log(teacher);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTeacherForm teacherData={teacher} />
      </Suspense>
    </div>
  );
}

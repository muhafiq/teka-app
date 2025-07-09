import EditStudentForm from "@/components/dashboard/edit-student-form";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";

export default async function EditStudentPage({ params }) {
  const { id } = await params;
  const [student] = await db.select().from(students).where(eq(students.id, id));

  return (
    <div className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <EditStudentForm student={student} />
      </Suspense>
    </div>
  );
}

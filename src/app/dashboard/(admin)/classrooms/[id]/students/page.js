import { db } from "@/lib/db";
import {
  classrooms,
  parents,
  students,
  teachers,
  users,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default async function StudentsClass({ params }) {
  const { id: classroomId } = await params;

  const classroom = await db
    .select({
      id: classrooms.id,
      location: classrooms.location,
      type: classrooms.type,
      waliKelas: users.name,
    })
    .from(classrooms)
    .leftJoin(teachers, eq(classrooms.waliKelas, teachers.id))
    .leftJoin(users, eq(teachers.userId, users.id))
    .where(eq(classrooms.id, classroomId))
    .then((res) => res[0]);

  if (!classroom) return notFound();

  const classroomStudents = await db
    .select({
      id: students.id,
      name: students.name,
      gender: students.gender,
      parentName: users.name,
      birthDate: students.birthDate,
      birthPlace: students.birthPlace,
      uniformSize: students.uniformSize,
    })
    .from(students)
    .where(eq(students.classroomId, classroomId))
    .leftJoin(parents, eq(students.parentId, parents.id))
    .leftJoin(users, eq(parents.userId, users.id));

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Kelas - {classroom.location}
          </CardTitle>
          <CardDescription>
            Wali Kelas: {classroom.waliKelas ?? "-"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 text-muted-foreground border-b">
                <TableHead className="w-12">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Tgl Lahir</TableHead>
                <TableHead>Nama Ortu</TableHead>
                <TableHead>Ukuran Seragam</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classroomStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell className="capitalize">
                    {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </TableCell>
                  <TableCell>{student.birthDate}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.uniformSize}</TableCell>
                </TableRow>
              ))}
              {classroomStudents.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-4 text-muted-foreground"
                  >
                    Belum ada siswa di kelas ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import {
  classrooms,
  parents,
  students,
  teachers,
  users,
} from "@/lib/db/schema";
import { eq, isNotNull } from "drizzle-orm";
import Link from "next/link";

export default async function TeacherDashboard() {
  const { user } = await auth();

  const [classroom] = await db
    .select({
      name: classrooms.location,
    })
    .from(teachers)
    .where(eq(teachers.userId, user.id))
    .leftJoin(classrooms, eq(teachers.id, classrooms.waliKelas));

  const allStudents = await db
    .select({
      id: students.id,
      name: students.name,
      gender: students.gender,
      parentName: users.name,
      parentPhone: users.phoneNumber,
    })
    .from(teachers)
    .leftJoin(classrooms, eq(teachers.id, classrooms.waliKelas))
    .leftJoin(students, eq(classrooms.id, students.classroomId))
    .leftJoin(parents, eq(students.parentId, parents.id))
    .leftJoin(users, eq(parents.userId, users.id))
    .where(isNotNull(students.id));

  return (
    <div className="p-6 space-y-6">
      {/* Kartu atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Murid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {allStudents.length || 0} Murid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{classroom.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel siswa */}
      <Card className="p-8 shadow-sm">
        <CardTitle className="text-xl font-semibold mb-2">
          Daftar Murid
        </CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Nama Orang Tua</TableHead>
              <TableHead>Nomor Telepon Orang Tua</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allStudents.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                </TableCell>
                <TableCell>{student.parentName}</TableCell>
                <TableCell>
                  <Link
                    target="_blank"
                    href={`https://wa.me/${student.parentPhone}`}
                    className="hover:text-blue-500"
                  >
                    {student.parentPhone}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

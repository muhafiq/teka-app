import Link from "next/link";
import { db } from "@/lib/db";
import { teachers, users } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eq } from "drizzle-orm";
import { role } from "@/helpers/schema";
import { Suspense } from "react";
import { DeleteTeacherForm } from "@/components/dashboard/delete-teacher-form";

export default async function TeacherPage() {
  const allTeachers = await db
    .select({
      userId: users.id,
      name: users.name,
      nip: teachers.nip,
      gender: teachers.gender,
      joinedDate: teachers.joinedDate,
      teacherId: teachers.id,
    })
    .from(users)
    .where(eq(users.role, role.teacher))
    .leftJoin(teachers, eq(users.id, teachers.userId));

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Daftar Guru Aktif</CardTitle>
          <Link href="/dashboard/teachers/create">
            <Button>+ Tambah Guru</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="w-[250px]">NIP</TableHead>
                <TableHead className="w-[150px]">Jenis Kelamin</TableHead>
                <TableHead className="w-[120px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Belum ada data guru.
                  </TableCell>
                </TableRow>
              ) : (
                allTeachers.map((teacher, index) => (
                  <TableRow
                    key={teacher.userId}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>

                    <TableCell>{teacher.name}</TableCell>

                    <TableCell>{teacher.nip || "-"}</TableCell>

                    <TableCell>
                      {teacher.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </TableCell>

                    <TableCell className="text-center">
                      <div>
                        <Link
                          href={`/dashboard/teachers/${teacher.teacherId}/edit`}
                        >
                          <Button variant="outline" size="sm" className="mr-1">
                            Edit
                          </Button>
                        </Link>

                        <Suspense fallback={<div>Loading...</div>}>
                          <DeleteTeacherForm userId={teacher.userId} />
                        </Suspense>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

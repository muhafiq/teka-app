import Link from "next/link";
import { db } from "@/lib/db";
import { classrooms, teachers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
import { ToastHandler } from "@/components/toast-handler";
import { DeleteClassroomForm } from "@/components/dashboard/delete-classrooms-form";
import { Suspense } from "react";

export default async function ClassroomsPage() {
  const allClassrooms = await db
    .select({
      id: classrooms.id,
      location: classrooms.location,
      type: classrooms.type,
      capacity: classrooms.capacity,
      waliKelasId: teachers.id,
      waliKelasName: users.name,
    })
    .from(classrooms)
    .leftJoin(teachers, eq(classrooms.waliKelas, teachers.id))
    .leftJoin(users, eq(teachers.userId, users.id));

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <ToastHandler message="Berhasil menambahkan kelas baru!" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Daftar Kelas</CardTitle>
          <Link href="/dashboard/classrooms/create">
            <Button>+ Tambah Kelas</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow className="font-bold">
                <TableHead className="w-12">No</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Tambahkan pengecekan jika array kosong */}
              {allClassrooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Belum ada data kelas yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                allClassrooms.map((classroom, index) => (
                  <TableRow
                    key={classroom.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>

                    <TableCell>
                      <Link
                        href={`/dashboard/classrooms/${classroom.id}/students`}
                        className="font-medium text-primary hover:underline"
                      >
                        {classroom.location}
                      </Link>
                    </TableCell>

                    <TableCell className="capitalize">
                      {classroom.type}
                    </TableCell>

                    <TableCell className="text-center">
                      {classroom.capacity}
                    </TableCell>

                    <TableCell>{classroom.waliKelasName ?? "-"}</TableCell>
                    <TableCell>
                      <Button variant="outline" className="mr-1">
                        <Link
                          href={`/dashboard/classrooms/${classroom.id}/edit`}
                        >
                          Edit
                        </Link>
                      </Button>
                      <Suspense fallback={<div>Loading...</div>}>
                        <DeleteClassroomForm classroomId={classroom.id} />
                      </Suspense>
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

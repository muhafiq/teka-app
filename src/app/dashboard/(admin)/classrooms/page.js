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
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClassrooms.map((classroom, index) => (
                <TableRow
                  key={classroom.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="p-0" colSpan={5}>
                    <Link
                      href={`/dashboard/classrooms/${classroom.id}/students`}
                      className="flex w-full h-full px-4 py-3"
                    >
                      <div className="w-12">{index + 1}</div>
                      <div className="flex-1">{classroom.location}</div>
                      <div className="flex-1 capitalize">{classroom.type}</div>
                      <div className="w-24">{classroom.capacity}</div>
                      <div className="flex-1">
                        {classroom.waliKelasName ?? "-"}
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { db } from "@/lib/db";
import { students, teachers, classrooms, events } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalStudents,
    totalTeachers,
    totalClassrooms,
    upcomingEvents,
    recentStudents,
  ] = await Promise.all([
    db
      .select()
      .from(students)
      .then((res) => res.length),
    db
      .select()
      .from(teachers)
      .then((res) => res.length),
    db
      .select()
      .from(classrooms)
      .then((res) => res.length),
    db.select().from(events).orderBy(desc(events.date)).limit(3),
    db.select().from(students).orderBy(desc(students.createdAt)).limit(5),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Guru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTeachers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalClassrooms}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Kegiatan Terdekat</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground">
              Belum ada kegiatan terjadwal.
            </p>
          ) : (
            <ul className="space-y-2">
              {upcomingEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{event.eventName}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.date} • {event.type}
                    </p>
                  </div>
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Button variant="outline" size="sm">
                      Lihat
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <CardTitle>Siswa Baru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentStudents.length === 0 ? (
            <p className="text-muted-foreground">Belum ada siswa baru.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="capitalize">
                      {student.gender == "L" ? "Laki-laki" : "Perempuan"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

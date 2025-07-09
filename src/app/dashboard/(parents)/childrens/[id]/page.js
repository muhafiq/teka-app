import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import {
  classrooms,
  parents,
  students,
  teachers,
  users,
  events,
  eventImages,
  invoices,
} from "@/lib/db/schema";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { invoiceStatus } from "@/helpers/schema";
import Image from "next/image";

export default async function StudentDetails() {
  const { user } = await auth();

  if (!user) return notFound();

  const [parent] = await db
    .select({ id: parents.id })
    .from(parents)
    .where(eq(parents.userId, user.id));
  const [student] = await db
    .select({
      id: students.id,
      name: students.name,
      waliKelas: users.name,
      address: students.address,
      gender: students.gender,
      birthPlace: students.birthPlace,
      birthDate: students.birthDate,
    })
    .from(students)
    .leftJoin(classrooms, eq(students.classroomId, classrooms.id))
    .leftJoin(teachers, eq(classrooms.waliKelas, teachers.id))
    .leftJoin(users, eq(teachers.userId, users.id))
    .where(eq(students.parentId, parent.id));

  const allEvents = await db
    .select({
      id: events.id,
      name: events.eventName,
      description: events.description,
      date: events.date,
      images: eventImages.imageUrl,
    })
    .from(students)
    .innerJoin(classrooms, eq(students.classroomId, classrooms.id))
    .innerJoin(teachers, eq(classrooms.waliKelas, teachers.id))
    .innerJoin(users, eq(teachers.userId, users.id))
    .innerJoin(events, eq(events.createdBy, users.id))
    .leftJoin(eventImages, eq(eventImages.eventId, events.id))
    .where(eq(students.id, student.id));

  const allInvoices = await db
    .select()
    .from(invoices)
    .where(
      eq(invoices.studentId, student.id),
      eq(invoices.status, invoiceStatus.unpaid)
    );

  console.log(allEvents);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Student Info Card */}
      <Card className="shadow-md">
        <CardContent className="flex items-center gap-6 p-6">
          {/* Avatar */}
          <Avatar className="w-24 h-24">
            <AvatarImage src="" alt="Foto siswa" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-gray-500 text-sm">Murid</p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-700 mt-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Wali Murid: {student.waliKelas}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Alamat: {student.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  Jenis Kelamin:{" "}
                  {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  TTL: {`${student.birthPlace}, ${student.birthDate}`}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="shadow-md p-8">
        <CardTitle className="text-xl">Riwayat Kegiatan</CardTitle>
        <CardContent>
          {allEvents.length == 0 ? (
            <div>Siswa belum memiliki kegiatan</div>
          ) : (
            allEvents.map((evt) => (
              <Card key={evt.id} className="overflow-hidden">
                {evt.images && (
                  <Image
                    src={evt.images}
                    alt={evt.eventName}
                    width={300}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{evt.eventName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {evt.type} • {evt.date}
                  </p>
                </CardHeader>
                <CardContent>
                  <p>{evt.description || "Tidak ada deskripsi."}</p>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm p-8">
        <CardTitle className="text-xl flex items-center justify-between">
          <div>Informasi Tagihan</div>
          <div>
            <Link href="/dashboard/payments">
              <Button>Ke Halaman Pembayaran</Button>
            </Link>
          </div>
        </CardTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tagihan</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Terakhir Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInvoices.length == 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  Siswa belum memiliki tagihan lagi.
                </TableCell>
              </TableRow>
            ) : (
              allInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.category}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>
                    {inv.due_date.toISOString().slice(0, 10)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

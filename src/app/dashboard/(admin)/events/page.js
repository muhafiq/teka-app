import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { events, eventImages } from "@/lib/db/schema";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ToastHandler } from "@/components/toast-handler";
import Image from "next/image";

// (opsional) Untuk format tanggal
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function EventsPage() {
  const allEvents = await db.select().from(events).orderBy(events.date);

  // 🔁 Ambil gambar untuk setiap event
  const eventsWithImages = await Promise.all(
    allEvents.map(async (event) => {
      const [image] = await db
        .select()
        .from(eventImages)
        .where(eq(eventImages.eventId, event.id));

      return {
        ...event,
        imageUrl: image?.imageUrl ?? null,
      };
    })
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <ToastHandler message="Berhasil membuat kegiatan baru!" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daftar Kegiatan Sekolah</h1>
        <Link href="/dashboard/events/create">
          <Button>+ Tambah Kegiatan</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {eventsWithImages.length === 0 && (
          <p className="text-muted-foreground">Belum ada kegiatan.</p>
        )}

        {eventsWithImages.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            {event.imageUrl && (
              <Image
                src={event.imageUrl}
                alt={event.eventName}
                width={300}
                height={300}
                className="h-48 w-full object-cover"
              />
            )}
            <CardHeader>
              <CardTitle>{event.eventName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {event.type} •{" "}
                {format(new Date(event.date), "d MMMM yyyy", { locale: id })}
              </p>
            </CardHeader>
            <CardContent>
              <p>{event.description || "Tidak ada deskripsi."}</p>

              {/* (opsional) tombol detail */}
              <div className="mt-4">
                <Link href={`/dashboard/events/${event.id}`}>
                  <Button>Lihat Detail</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { events, eventImages } from "@/lib/db/schema";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ToastHandler } from "@/components/toast-handler";
import Image from "next/image";

export default async function EventsPage() {
  const allEvents = await db.select().from(events).orderBy(events.date);

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
        {allEvents.length === 0 && (
          <p className="text-muted-foreground">Belum ada kegiatan.</p>
        )}

        {await Promise.all(
          allEvents.map(async (event) => {
            const [image] = await db
              .select()
              .from(eventImages)
              .where(eq(eventImages.eventId, event.id));

            return (
              <Card key={event.id} className="overflow-hidden">
                {image?.imageUrl && (
                  <Image
                    src={image.imageUrl}
                    alt={event.eventName}
                    width={300}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{event.eventName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {event.type} • {event.date}
                  </p>
                </CardHeader>
                <CardContent>
                  <p>{event.description || "Tidak ada deskripsi."}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

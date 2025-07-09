import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { events, eventImages } from "@/lib/db/schema";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ToastHandler } from "@/components/toast-handler";
import EventTable from "@/components/dashboard/event-table";
import { auth } from "@/auth";
import { role } from "@/helpers/schema";

export default async function EventsPage() {
  const { user } = await auth();

  let allEvents;
  let eventsWithImages;

  if (user.role === role.admin) {
    allEvents = await db.select().from(events).orderBy(desc(events.date));

    // 🔁 Ambil gambar untuk setiap event
    eventsWithImages = await Promise.all(
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
  } else if (user.role === role.teacher) {
    allEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.date))
      .where(eq(events.createdBy, user.id));

    // 🔁 Ambil gambar untuk setiap event
    eventsWithImages = await Promise.all(
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
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <ToastHandler message="Berhasil membuat kegiatan baru!" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daftar Kegiatan Sekolah</h1>
        <Link href="/dashboard/events/create">
          <Button>+ Tambah Kegiatan</Button>
        </Link>
      </div>

      <div>
        {eventsWithImages.length === 0 && (
          <p className="text-muted-foreground">Belum ada kegiatan.</p>
        )}

        <EventTable events={eventsWithImages} />
      </div>
    </div>
  );
}

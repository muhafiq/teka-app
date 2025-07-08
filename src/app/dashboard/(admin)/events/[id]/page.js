import { db } from "@/lib/db";
import { events, subEvents, eventImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EventDetailPage({ params }) {
  const eventId = params.id;

  // Ambil data event
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) return notFound();

  // Ambil gambar utama
  const [mainImage] = await db
    .select()
    .from(eventImages)
    .where(eq(eventImages.eventId, eventId));

  // Ambil sub kegiatan
  const subEventList = await db
    .select()
    .from(subEvents)
    .where(eq(subEvents.eventId, eventId));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link href="/dashboard/events" className="text-sm text-blue-600">
        ← Kembali ke daftar kegiatan
      </Link>
      <br></br><br></br>
      <h1 className="text-3xl font-bold">{event.eventName}</h1><br></br>

      {mainImage?.imageUrl && (
        <Image
          src={mainImage.imageUrl}
          alt={event.eventName}
          width={600}
          height={300}
          className="rounded-md mt-4 object-cover w-full max-h-[400px]"
        />
      )}

      <p className="text-muted-foreground">
        {event.type} • {event.date}
      </p>

      <p className="mt-4">{event.description || "Tidak ada deskripsi."}</p>

      {/* Sub kegiatan */}
      {subEventList.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-8">Sub Kegiatan</h2>
          <ul className="space-y-6 mt-4">
            {await Promise.all(
              subEventList.map(async (sub) => {
                const images = await db
                  .select()
                  .from(eventImages)
                  .where(eq(eventImages.subEventId, sub.id));

                return (
                  <li key={sub.id} className="p-4 border rounded-md">
                    <h3 className="font-semibold text-lg">{sub.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {sub.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2">
                      {images.map((img) => (
                        <div
                          key={img.id}
                          className="border-2 rounded-md overflow-hidden w-64"
                          style={{ borderColor: "var(--primary)" }}
                        >
                          <img
                            src={img.imageUrl}
                            alt="Sub event"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </>
      )}
    </div>
  );
}
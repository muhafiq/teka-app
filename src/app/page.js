import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/public/header";
import Footer from "@/components/public/footer";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { gt } from "drizzle-orm";

export default async function HomePage() {
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(gt(events.date, new Date().toISOString()))
    .limit(5);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Konten Utama */}
      <main className="flex-1 bg-background py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Hero Section */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-4xl font-bold text-primary">
              Selamat Datang di TK Tadika Mesra hdbiewbdibdedibe🌼
            </h1>
            <p className="text-muted-foreground text-lg">
              Tempat terbaik untuk anak-anak belajar dan bermain dengan penuh
              cinta dan kreativitas.
            </p>

            <section id="tentang" className="space-y-3">
              <h2 className="text-2xl font-semibold">Kenapa memilih kami?</h2>
              <ul className="list-disc pl-6 text-muted-foreground text-sm">
                <li>Lingkungan belajar yang aman & menyenangkan</li>
                <li>Guru-guru profesional dan penyayang</li>
                <li>Kegiatan edukatif dan menyenangkan setiap minggu</li>
              </ul>
              <Button className="mt-4" asChild>
                <Link href="/register">Daftarkan Anak Sekarang</Link>
              </Button>
            </section>
          </div>

          {/* Card Kegiatan */}
          <section id="kegiatan">
            <Card className="shadow-md border-muted">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Kegiatan Mendatang</CardTitle>
                  <CardDescription className="text-xs">
                    Jangan lewatkan ya!
                  </CardDescription>
                </div>
                <CalendarDays className="text-muted-foreground w-6 h-6" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {upcomingEvents.map((e) => (
                  <Card
                    key={e.id}
                    className="space-y-4 text-sm p-4 flex-row items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold mb-2">{e.eventName}</p>
                      <p className="text-muted-foreground">📅 {e.date}</p>
                    </div>
                    <Link href={`/events/${e.id}`} className="cursor-pointer">
                      <Button variant="secondary" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

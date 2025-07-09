import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import DeleteEventForm from "./delete-event-form";
import { Suspense } from "react";

export default function EventTable({ events }) {
  return (
    <div className="rounded-md border p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama Kegiatan</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={event.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.eventName}
                    width={64}
                    height={64}
                    className="object-cover h-16 w-16 rounded"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Tanpa Gambar
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/events/${event.id}`}
                  className="flex items-center gap-1 hover:text-blue-500"
                >
                  {event.eventName} <ExternalLink size={16} />
                </Link>
              </TableCell>
              <TableCell>
                {format(new Date(event.date), "dd MMMM yyyy", {
                  locale: id,
                })}
              </TableCell>
              <TableCell>{event.type}</TableCell>
              <TableCell className="text-right flex items-center justify-center gap-1">
                <Suspense fallback={<div>Loading...</div>}>
                  <DeleteEventForm eventId={event.id} />
                </Suspense>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

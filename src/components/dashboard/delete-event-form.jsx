"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/lib/actions/event";

export default function DeleteEventForm({ eventId }) {
  const [state, formAction, isPending] = useActionState(deleteEvent, {
    success: false,
    message: "",
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Berhasil menghapus kegiatan!");
      setOpen(false);
      router.push("/dashboard/events");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Hapus</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <p>Apakah kamu yakin ingin menghapus kegiatan ini?</p>

        {!state.success && (
          <p className="text-sm text-red-500 mt-2">{state.message}</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>

          <form action={formAction}>
            <input type="hidden" value={eventId} name="eventId" />
            <Button type="submit" variant="destructive">
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

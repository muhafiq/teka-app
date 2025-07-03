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
import { deleteClassroom } from "@/lib/actions/classrooms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteClassroomForm({ classroomId }) {
  const [errorMessage, formAction, isPending] = useActionState(
    deleteClassroom,
    undefined
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (errorMessage === null) {
      toast.success("Berhasil menghapus kelas!");
      setOpen(false);
      router.push("/dashboard/classrooms");
    }
  }, [errorMessage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Hapus</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <p>Apakah kamu yakin ingin menghapus kelas ini?</p>

        {errorMessage && (
          <p className="text-sm text-red-500 mt-2">{errorMessage.message}</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>

          <form action={formAction}>
            <input type="hidden" value={classroomId} name="classroomId" />
            <Button type="submit" variant="destructive">
              Ya, Hapus
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

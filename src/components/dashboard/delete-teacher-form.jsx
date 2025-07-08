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
import { deleteTeacher } from "@/lib/actions/teachers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteTeacherForm({ userId }) {
  const [state, formAction, isPending] = useActionState(deleteTeacher, {
    success: false,
    message: "",
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Berhasil menghapus guru!");
      setOpen(false);
      router.push("/dashboard/teachers");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Hapus</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <p>Apakah kamu yakin ingin menghapus data guru ini?</p>

        {state && <p className="text-sm text-red-500 mt-2">{state.message}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>

          <form action={formAction}>
            <input type="hidden" value={userId} name="userId" />
            <Button type="submit" variant="destructive">
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomInvoices } from "@/lib/actions/invoices";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

export default function CreateInvoiceCustom({ students }) {
  const [state, formAction, isPending] = useActionState(createCustomInvoices, {
    success: false,
    message: "",
    errors: {},
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/invoices");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="studentId">Tagihan Untuk Siswa</Label>
        <Select name="studentId" required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih nama siswa" />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Jumlah Tagihan</Label>
        <Input id="amount" name="amount" type="number" required />
        {state.errors?.amount && (
          <p className="text-sm text-red-500">{state.errors.amount}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Kategori</Label>
        <Input id="category" name="category" required />
        {state.errors?.category && (
          <p className="text-sm text-red-500">{state.errors.category}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dueDate">Jatuh Tempo</Label>
        <Input id="dueDate" name="dueDate" type="date" required />
        {state.errors?.dueDate && (
          <p className="text-sm text-red-500">{state.errors.dueDate}</p>
        )}
      </div>

      {!state.success && state.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Buat Tagihan"}
      </Button>
    </form>
  );
}

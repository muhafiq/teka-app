"use client";

import { useActionState } from "react";
import { createEvent } from "@/lib/actions/event";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateEventPage() {
  const [error, formAction, isPending] = useActionState(createEvent, undefined);

  return (
    <form action={formAction} className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tambah Kegiatan</h2>
        <p className="text-muted-foreground text-sm">
          Isikan informasi kegiatan sekolah di bawah ini.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventName">Nama Kegiatan</Label>
        <Input id="eventName" name="eventName" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Tanggal Kegiatan</Label>
        <Input id="date" name="date" type="date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Jenis Kegiatan</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis kegiatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="class">Kegiatan Kelas</SelectItem>
            <SelectItem value="school">Kegiatan Sekolah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" name="description" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Gambar Kegiatan</Label>
        <Input id="image" name="image" type="file" accept="image/*" required />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
